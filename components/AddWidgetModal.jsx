import React, { useState, useEffect } from 'react';
import { WidgetType, ChartType } from '../types';

const initialMetricState = {
    title: '',
    type: WidgetType.Metric,
    value: '',
    unit: '',
    trend: '',
    trendDirection: 'up',
};

const initialChartState = {
    title: '',
    type: WidgetType.Chart,
    chartType: ChartType.Bar,
    dataKey: 'value',
    nameKey: 'name',
    data: [{ name: 'Sample A', value: 100 }, { name: 'Sample B', value: 200 }],
};

const AddWidgetModal = ({ isOpen, onClose, onAdd }) => {
    const [selectedType, setSelectedType] = useState(null);
    const [formData, setFormData] = useState(initialMetricState);
    const [jsonInput, setJsonInput] = useState('');
    const [jsonError, setJsonError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape' && !isSubmitting) {
                handleClose();
            }
        };
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose, isSubmitting]);

    const handleClose = () => {
        setSelectedType(null);
        setJsonError(null);
        setFormData(initialMetricState);
        setIsSubmitting(false);
        onClose();
    }

    const handleSelectType = (type) => {
        setSelectedType(type);
        if (type === WidgetType.Metric) {
            setFormData(initialMetricState);
        } else {
            setFormData(initialChartState);
            setJsonInput(JSON.stringify(initialChartState.data, null, 2));
        }
    };

    const handleBack = () => {
        setSelectedType(null);
        setJsonError(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleJsonInputChange = (e) => {
        setJsonInput(e.target.value);
        if (jsonError) setJsonError(null);
    };

    const handleAddWidget = (e) => {
        e.preventDefault();

        // Validate JSON for chart widgets before submitting
        if (formData.type === WidgetType.Chart) {
            try {
                JSON.parse(jsonInput);
            } catch (error) {
                setJsonError("Invalid JSON format. Please check your data.");
                return;
            }
        }

        setJsonError(null);
        
        const finalWidgetData = formData.type === WidgetType.Chart 
            ? { ...formData, data: JSON.parse(jsonInput) }
            : formData;

        onAdd(finalWidgetData);
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) handleClose();
    };

    if (!isOpen) return null;
    
    const inputClasses = "w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm px-3 py-2 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300";

    const renderFormFields = () => (
        <>
            <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Title</label>
                <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className={inputClasses} required />
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
                    <div>
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
                        <select name="chartType" id="chartType" value={formData.chartType} onChange={handleChange} className={inputClasses}>
                            {Object.values(ChartType).map(type => (
                                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                            ))}
                        </select>
                    </div>
                     <div className="mb-4">
                        <label htmlFor="dataKey" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                            Data Key
                        </label>
                        <input type="text" name="dataKey" id="dataKey" value={formData.dataKey} onChange={handleChange} className={inputClasses} required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="nameKey" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                            Category/Label Key
                        </label>
                        <input type="text" name="nameKey" id="nameKey" value={formData.nameKey} onChange={handleChange} className={inputClasses} required />
                    </div>
                     <div>
                         <label htmlFor="jsonData" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Chart Data (JSON)</label>
                         <textarea id="jsonData" name="jsonData" rows={6} className={`${inputClasses} font-mono text-sm`} value={jsonInput} onChange={handleJsonInputChange} required />
                         {jsonError && <p className="mt-2 text-sm text-red-500 dark:text-red-400">{jsonError}</p>}
                     </div>
                </>
            )}
        </>
    );
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 dark:bg-opacity-70 z-50 flex justify-center items-center p-4" role="dialog" aria-modal="true" aria-labelledby="add-widget-title" onClick={handleBackdropClick}>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-md transition-all duration-300" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleAddWidget}>
                    <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <h2 id="add-widget-title" className="text-xl font-bold text-slate-900 dark:text-white">
                            {selectedType ? `Create ${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Widget` : 'Select Widget Type'}
                        </h2>
                        {selectedType && (
                             <button type="button" onClick={handleBack} className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Back</button>
                        )}
                    </div>
                    <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto">
                        {!selectedType ? (
                            <div className="space-y-4">
                                <button type="button" onClick={() => handleSelectType(WidgetType.Metric)} className="w-full text-left p-4 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <h3 className="font-bold text-lg text-slate-800 dark:text-white">Metric Widget</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Display a single key number, like total sales or user count.</p>
                                </button>
                                <button type="button" onClick={() => handleSelectType(WidgetType.Chart)} className="w-full text-left p-4 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                     <h3 className="font-bold text-lg text-slate-800 dark:text-white">Chart Widget</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Visualize a dataset as a bar, line, pie, or other chart type.</p>
                                </button>
                            </div>
                        ) : (
                            renderFormFields()
                        )}
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex justify-end space-x-3 rounded-b-lg">
                        <button type="button" onClick={handleClose} disabled={isSubmitting} className="bg-white dark:bg-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-white font-semibold py-2 px-4 rounded-lg border border-slate-300 dark:border-slate-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">Cancel</button>
                        {selectedType && (
                           <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
                             Create Widget
                           </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddWidgetModal;
