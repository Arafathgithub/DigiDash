import React from 'react';
import { WidthProvider, Responsive } from 'react-grid-layout';
import Widget from './Widget';

const ResponsiveGridLayout = WidthProvider(Responsive);

const Dashboard = ({ widgets, layouts, onLayoutChange, onEditWidget, onDeleteWidget }) => {
  const generateDOM = () => {
    return widgets.map((widget) => (
      <div key={widget.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors duration-300">
        <Widget 
          widget={widget} 
          onEdit={() => onEditWidget(widget)}
          onDelete={() => onDeleteWidget(widget.id)}
        />
      </div>
    ));
  };

  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={layouts}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 4, md: 2, sm: 1, xs: 1, xxs: 1 }}
      rowHeight={150}
      onLayoutChange={onLayoutChange}
      draggableHandle=".drag-handle"
    >
      {generateDOM()}
    </ResponsiveGridLayout>
  );
};

export default Dashboard;