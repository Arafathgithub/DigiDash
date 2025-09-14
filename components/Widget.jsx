import React from 'react';
import { WidgetType } from '../types';
import MetricCard from './MetricCard';
import ChartCard from './ChartCard';

const DragHandleIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
    </svg>
);

const PencilIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
);

const TrashIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.033-2.134H8.033c-1.12 0-2.033.954-2.033 2.134v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
);


const Widget = ({ widget, onEdit, onDelete }) => {
  const renderContent = () => {
    switch (widget.type) {
      case WidgetType.Metric:
        return <MetricCard data={widget} />;
      case WidgetType.Chart:
        return <ChartCard data={widget} />;
      default:
        return <div>Unknown widget type</div>;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="drag-handle cursor-move bg-slate-50 dark:bg-slate-800 p-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between transition-colors duration-300">
        <h3 className="font-semibold text-slate-700 dark:text-slate-200 truncate pr-2">{widget.title}</h3>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <button onClick={onEdit} aria-label={`Edit ${widget.title}`} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <PencilIcon className="h-5 w-5" />
          </button>
          <button onClick={onDelete} aria-label={`Delete ${widget.title}`} className="text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-500 transition-colors p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500">
            <TrashIcon className="h-5 w-5" />
          </button>
          <div className="cursor-move">
            <DragHandleIcon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
          </div>
        </div>
      </div>
      <div className="flex-grow p-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default Widget;