// Sample DWLR station data for the Jalandhar area
export const stations = [
  {
    id: 'JLN001',
    name: 'DWLR Station - Nurmahal',
    coordinate: { latitude: 31.0991, longitude: 75.5908 },
    hgi_status: 'Red', // Critical
  },
  {
    id: 'JLN002',
    name: 'DWLR Station - Phillaur',
    coordinate: { latitude: 31.0254, longitude: 75.7874 },
    hgi_status: 'Red', // Critical
  },
  {
    id: 'JLN003',
    name: 'DWLR Station - Shahkot',
    coordinate: { latitude: 31.0772, longitude: 75.3407 },
    hgi_status: 'Yellow', // Over-exploited
  },
  {
    id: 'JLN004',
    name: 'DWLR Station - Adampur',
    coordinate: { latitude: 31.4314, longitude: 75.7226 },
    hgi_status: 'Green', // Safe
  },
  {
    id: 'JLN005',
    name: 'DWLR Station - Nakodar',
    coordinate: { latitude: 31.1257, longitude: 75.4746 },
    hgi_status: 'Yellow', // Over-exploited
  },
  {
    id: 'JLN006',
    name: 'Central Jalandhar Monitor',
    coordinate: { latitude: 31.3260, longitude: 75.5762 },
    hgi_status: 'Green', // Safe
  },
  // Add more stations to see clustering in action
  {
    id: 'JLN007',
    name: 'Goraya Monitoring Well',
    coordinate: { latitude: 31.1293, longitude: 75.7725 },
    hgi_status: 'Red',
  },
];