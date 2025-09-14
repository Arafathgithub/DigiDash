import React, { useState, useEffect } from 'react';
import { WidgetType, ChartType } from '../types';

const EditWidgetModal = ({ widget, onClose, onSave }) => {
    const [formData, setFormData] = useState(widget);
    const [jsonInput, setJsonInput] = useState('');
    const [jsonError, setJsonError] = useState(null);

    useEffect(() => {
        setFormData(widget);
        if (widget.type === WidgetType.Chart) {
            setJsonInput(JSON.stringify(widget.data, null, 2));
            setJsonError(null);
        }
    }, [widget]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            if (!prev) return prev;
            
            if (prev.type === WidgetType.Metric && (name === 'trendDirection')) {
                return { ...prev, [name]: value };
            }

            if (prev.type === WidgetType.Chart && (name === 'chartType')) {
                return { ...prev, [name]: value };
            }

            return { ...prev, [name]: value };
        });
    };
    
    const handleJsonInputChange = (e) => {
        setJsonInput(e.target.value);
        if (jsonError) {
            setJsonError(null);
        }
    };

    const handleParseJson = () => {
        try {
            const parsedData = JSON.parse(jsonInput);
            if (!Array.isArray(parsedData)) {
                throw new Error("Data must be an array of objects.");
            }
            setFormData(prev => ({ ...prev, data: parsedData }));
            setJsonError(null);
            alert('JSON data parsed and updated successfully!');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Invalid JSON format.";
            setJsonError(errorMessage);
            alert(`Error parsing JSON: ${errorMessage}`);
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    
    const inputClasses = "w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm px-3 py-2 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300";

    const renderFormFields = () => {
        return (
            <>
                <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Title</label>
                    <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className={inputClasses} required />
                </div>
                <div className="mb-4">
                    <label htmlFor="dataSourceUrl" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Data Source URL (Optional)</label>
                    <input type="url" name="dataSourceUrl" id="dataSourceUrl" value={formData.dataSourceUrl || ''} onChange={handleChange} className={inputClasses} placeholder="https://api.example.com/data" />
                </div>
                {formData.type === WidgetType.Metric && (
                    <>
                         <div className="mb-4">
                            <label htmlFor="value" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Value</label>
                            <input type="text" name="value" id="value" value={formData.value} onChange={handleChange} className={inputClasses} required />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="unit" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Unit (Optional)</label>
                            <input type="text" name="unit" id="unit" value={formData.unit || ''} onChange={handleChange} className={inputClasses} />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="trend" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Trend (Optional)</label>
                            <input type="text" name="trend" id="trend" value={formData.trend || ''} onChange={handleChange} className={inputClasses} />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="trendDirection" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Trend Direction</label>
                            <select name="trendDirection" id="trendDirection" value={formData.trendDirection || 'up'} onChange={handleChange} className={inputClasses}>
                                <option value="up">Up</option>
                                <option value="down">Down</option>
                            </select>
                        </div>
                    </>
                )}
                {formData.type === WidgetType.Chart && (
                     <>
                        <div className="mb-4">
                            <label htmlFor="chartType" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Chart Type</label>
                            <select
                                name="chartType"
                                id="chartType"
                                value={formData.chartType}
                                onChange={handleChange}
                                className={inputClasses}
                            >
                                {Object.values(ChartType).map(type => (
                                    <option key={type} value={type}>
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                         <div className="mb-4">
                            <label htmlFor="dataKey" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                                { formData.chartType === ChartType.Scatter ? 'X-Axis Data Key' : 'Data Key' }
                            </label>
                            <input type="text" name="dataKey" id="dataKey" value={formData.dataKey} onChange={handleChange} className={inputClasses} required />
                        </div>
                        {formData.chartType === ChartType.Scatter && (
                             <div className="mb-4">
                                <label htmlFor="yDataKey" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Y-Axis Data Key</label>
                                <input type="text" name="yDataKey" id="yDataKey" value={formData.yDataKey || ''} onChange={handleChange} className={inputClasses} required />
                            </div>
                        )}
                        <div className="mb-4">
                            <label htmlFor="nameKey" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                                { formData.chartType === ChartType.Pie ? 'Name Key' : 'Category/Label Key' }
                            </label>
                            <input type="text" name="nameKey" id="nameKey" value={formData.nameKey} onChange={handleChange} className={inputClasses} required />
                        </div>
                         <div className="mb-4">
                             <label htmlFor="jsonData" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                                 Chart Data (JSON)
                             </label>
                             <textarea
                                 id="jsonData"
                                 name="jsonData"
                                 rows={8}
                                 className={`${inputClasses} font-mono text-sm`}
                                 value={jsonInput}
                                 onChange={handleJsonInputChange}
                                 placeholder='e.g., [{"month": "Jan", "sales": 4000}]'
                             />
                         </div>
                         <div className="mb-4 flex items-center justify-between">
                             <button
                                 type="button"
                                 onClick={handleParseJson}
                                 className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                             >
                                 Update Chart Data
                             </button>
                             {jsonError && <p className="text-sm text-red-500 dark:text-red-400">{jsonError}</p>}
                         </div>
                    </>
                )}
            </>
        )
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 dark:bg-opacity-70 z-50 flex justify-center items-center p-4" role="dialog" aria-modal="true" aria-labelledby="edit-widget-title" onClick={handleBackdropClick}>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-md transition-colors duration-300" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSave}>
                    <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700">
                        <h2 id="edit-widget-title" className="text-xl font-bold text-slate-900 dark:text-white">Edit Widget</h2>
                    </div>
                    <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto">
                        {renderFormFields()}
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex justify-end space-x-3 rounded-b-lg">
                        <button type="button" onClick={onClose} className="bg-white dark:bg-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-white font-semibold py-2 px-4 rounded-lg border border-slate-300 dark:border-slate-500 transition-colors duration-200">Cancel</button>
                        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditWidgetModal;