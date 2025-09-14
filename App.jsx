import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AddWidgetModal from './components/AddWidgetModal';
import EditWidgetModal from './components/EditWidgetModal';
import ConfirmationModal from './components/ConfirmationModal';
import { DEFAULT_WIDGETS, DEFAULT_LAYOUTS } from './constants';
import { WidgetType } from './types';
import { addWidget as apiAddWidget } from './services/api';

const App = () => {
  const [widgets, setWidgets] = useState([]);
  const [layouts, setLayouts] = useState({});
  const [isMounted, setIsMounted] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingWidget, setEditingWidget] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deletingWidgetId, setDeletingWidgetId] = useState(null);
  const importFileRef = useRef(null);

  useEffect(() => {
    // Theme initialization
    const savedTheme = localStorage.getItem('dashboard-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);

    // Data initialization
    try {
      const savedWidgets = localStorage.getItem('dashboard-widgets');
      const savedLayouts = localStorage.getItem('dashboard-layouts');

      if (savedWidgets && savedLayouts) {
        setWidgets(JSON.parse(savedWidgets));
        setLayouts(JSON.parse(savedLayouts));
      } else {
        setWidgets(DEFAULT_WIDGETS);
        setLayouts(DEFAULT_LAYOUTS);
      }
    } catch (error) {
      console.error("Failed to parse from localStorage, using defaults.", error);
      setWidgets(DEFAULT_WIDGETS);
      setLayouts(DEFAULT_LAYOUTS);
    }
    setIsMounted(true);
  }, []);
  
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('dashboard-theme', theme);
    } catch (error) {
      console.error("Failed to save theme to localStorage.", error);
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleLayoutChange = useCallback((_currentLayout, allLayouts) => {
    if (JSON.stringify(allLayouts) !== JSON.stringify(layouts)) {
        setLayouts(allLayouts);
    }
  }, [layouts]);

  const handleSaveLayout = useCallback(() => {
    try {
      localStorage.setItem('dashboard-widgets', JSON.stringify(widgets));
      localStorage.setItem('dashboard-layouts', JSON.stringify(layouts));
      alert('Dashboard saved successfully!');
    } catch (error) {
      console.error("Failed to save to localStorage.", error);
      alert('Error saving dashboard.');
    }
  }, [widgets, layouts]);

  const handleResetLayout = useCallback(() => {
    if (window.confirm('Are you sure you want to reset the dashboard to its default state? This will clear any saved layout.')) {
      setWidgets(DEFAULT_WIDGETS);
      setLayouts(DEFAULT_LAYOUTS);
      localStorage.removeItem('dashboard-widgets');
      localStorage.removeItem('dashboard-layouts');
    }
  }, []);

  const handleExportDashboard = useCallback(() => {
    try {
        const dashboardData = { widgets, layouts };
        const jsonString = JSON.stringify(dashboardData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const timestamp = new Date().toISOString().replace(/:/g, '-');
        a.download = `dashboard-config-${timestamp}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Failed to export dashboard:', error);
        alert('Error exporting dashboard.');
    }
  }, [widgets, layouts]);

  const handleImportDashboard = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/json') {
        alert('Invalid file type. Please select a JSON file.');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const text = e.target?.result;
            if (typeof text !== 'string') {
                throw new Error('Failed to read file content.');
            }
            const importedData = JSON.parse(text);

            if (!importedData.widgets || !importedData.layouts || !Array.isArray(importedData.widgets) || typeof importedData.layouts !== 'object') {
                throw new Error('Invalid dashboard configuration file format.');
            }

            if (window.confirm('Importing this file will overwrite your current dashboard. Are you sure?')) {
                setWidgets(importedData.widgets);
                setLayouts(importedData.layouts);
                alert('Dashboard imported successfully! Remember to save the layout to keep the changes.');
            }
        } catch (error) {
            console.error('Failed to import dashboard:', error);
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            alert(`Error importing dashboard: ${errorMessage}`);
        } finally {
            if (importFileRef.current) {
                importFileRef.current.value = '';
            }
        }
    };
    reader.onerror = () => {
        alert('Error reading the file.');
        if (importFileRef.current) {
            importFileRef.current.value = '';
        }
    };
    reader.readAsText(file);
  };

  const triggerImportClick = () => {
      importFileRef.current?.click();
  };

  const handleOpenDeleteConfirm = useCallback((widgetId) => {
    setDeletingWidgetId(widgetId);
    setIsConfirmModalOpen(true);
  }, []);

  const handleCloseDeleteConfirm = () => {
    setDeletingWidgetId(null);
    setIsConfirmModalOpen(false);
  };
  
  const handleConfirmDelete = useCallback(() => {
    if (!deletingWidgetId) return;

    const newWidgets = widgets.filter(w => w.id !== deletingWidgetId);
    
    const newLayouts = {};
    for (const breakpoint in layouts) {
        if (Object.prototype.hasOwnProperty.call(layouts, breakpoint)) {
            newLayouts[breakpoint] = layouts[breakpoint].filter(l => l.i !== deletingWidgetId);
        }
    }

    setWidgets(newWidgets);
    setLayouts(newLayouts);
    handleCloseDeleteConfirm();
  }, [deletingWidgetId, widgets, layouts]);


  const handleOpenEditModal = (widget) => {
    setEditingWidget(widget);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingWidget(null);
  };

  const handleUpdateWidget = useCallback((updatedWidget) => {
    const widgetIndex = widgets.findIndex(w => w.id === updatedWidget.id);
    if (widgetIndex !== -1) {
      const newWidgets = [...widgets];
      newWidgets[widgetIndex] = updatedWidget;
      setWidgets(newWidgets);
    }
    handleCloseEditModal();
  }, [widgets]);

  const handleOpenAddModal = () => setIsAddModalOpen(true);
  const handleCloseAddModal = () => setIsAddModalOpen(false);

  const handleAddWidget = useCallback((widgetData) => {
    try {
      // Generate a unique ID locally
      const newId = `${widgetData.type.toLowerCase().replace(/\s/g, '-')}-${Date.now()}`;
      const newWidget = { ...widgetData, id: newId };
      const defaultSize = widgetData.type === WidgetType.Metric
        ? { w: 1, h: 1 }
        : { w: 2, h: 2 };

      const newLayouts = {};
      for (const breakpoint in layouts) {
        if (Object.prototype.hasOwnProperty.call(layouts, breakpoint)) {
          newLayouts[breakpoint] = [
            ...(layouts[breakpoint] || []),
            { i: newWidget.id, x: 0, y: Infinity, ...defaultSize }
          ];
        }
      }
      
      setWidgets(prev => [...prev, newWidget]);
      setLayouts(newLayouts);
      handleCloseAddModal();
    } catch (error) {
      console.error("Failed to add widget:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      alert(`Error: ${errorMessage}`);
    }
  }, [layouts]);
  
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-white transition-colors duration-300">
      <Header 
        onSave={handleSaveLayout} 
        onReset={handleResetLayout} 
        onAddWidget={handleOpenAddModal} 
        theme={theme} 
        onToggleTheme={handleToggleTheme}
        onExport={handleExportDashboard}
        onImport={triggerImportClick}
      />
      <main className="p-4 sm:p-6 lg:p-8">
        {isMounted && (
            <Dashboard 
                widgets={widgets} 
                layouts={layouts} 
                onLayoutChange={handleLayoutChange}
                onEditWidget={handleOpenEditModal}
                onDeleteWidget={handleOpenDeleteConfirm}
            />
        )}
      </main>
      <AddWidgetModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onAdd={handleAddWidget}
      />
      {isEditModalOpen && editingWidget && (
        <EditWidgetModal
            widget={editingWidget}
            onClose={handleCloseEditModal}
            onSave={handleUpdateWidget}
        />
      )}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={handleCloseDeleteConfirm}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this widget? This action cannot be undone."
      />
      <input
        type="file"
        ref={importFileRef}
        onChange={handleImportDashboard}
        accept="application/json"
        className="hidden"
        aria-hidden="true"
      />
    </div>
  );
};

export default App;
