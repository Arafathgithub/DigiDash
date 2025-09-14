/**
 * Simulates an API call to add a new widget.
 * In a real application, this would be an HTTP POST request to a backend server.
 * @param widgetData The data for the new widget, without an ID.
 * @returns A promise that resolves with the newly created widget, including a generated ID.
 */
export const addWidget = (widgetData) => {
  return new Promise((resolve, reject) => {
    // Simulate network latency
    setTimeout(() => {
      // Simulate a potential API error (e.g., 10% chance of failure)
      if (Math.random() < 0.1) {
        reject(new Error("Failed to create widget: A server error occurred."));
        return;
      }

      // Generate a unique ID on the "server"
      const newId = `${widgetData.type.toLowerCase().replace(/\s/g, '-')}-${Date.now()}`;
      
      // The "server" returns the complete widget object
      const newWidget = { ...widgetData, id: newId };
      
      console.log("Mock API: Widget created successfully", newWidget);
      resolve(newWidget);
    }, 800); // 800ms delay
  });
};
