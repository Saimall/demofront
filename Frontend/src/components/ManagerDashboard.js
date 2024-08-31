// import React from 'react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { Table, Button } from '@/components/ui/table';

// const performanceData = [
//   { name: 'Oct 2022', Project: 4, Target: 3 },
//   { name: 'Nov 2022', Project: 3, Target: 4 },
//   { name: 'Dec 2022', Project: 5, Target: 4 },
//   { name: 'Jan 2023', Project: 4, Target: 5 },
//   { name: 'Feb 2023', Project: 6, Target: 5 },
//   { name: 'Mar 2023', Project: 5, Target: 4 },
// ];

// const projectData = [
//   { id: 'PID462', name: 'ANDROID', startDate: '15/04/2023', endDate: '15/06/2023', description: 'This is Project Project' },
//   { id: 'PI0913', name: 'BANCHIO', startDate: '22/05/2023', endDate: '22/06/2023', description: 'This need to be implemented in SpringBoot' },
//   { id: 'PIA098', name: 'NIRBISA', startDate: '05/06/2023', endDate: '15/07/2023', description: 'This is related to Data Science' },
// ];

// const ManagerDashboard = () => {
//   return (
//     <div className="min-h-screen bg-gray-100">
//       <header className="bg-white shadow">
//         <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
//           <h1 className="text-2xl font-bold text-gray-900 flex items-center">
//             <svg className="w-8 h-8 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
//               <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
//             </svg>
//             PROJECT MANAGEMENT SYSTEM
//           </h1>
//           <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
//             Logout
//           </button>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//         <h2 className="text-2xl font-semibold text-center mb-6">MANAGER DASHBOARD</h2>
        
//         <div className="grid grid-cols-3 gap-6 mb-6">
//           <div className="col-span-2 bg-white p-4 rounded-lg shadow">
//             <h3 className="text-lg font-semibold mb-4">Performance</h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={performanceData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Line type="monotone" dataKey="Project" stroke="#8884d8" activeDot={{ r: 8 }} />
//                 <Line type="monotone" dataKey="Target" stroke="#82ca9d" />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
          
//           <div className="bg-white p-4 rounded-lg shadow">
//             <h3 className="text-lg font-semibold mb-4">User Profile</h3>
//             <p><strong>Name:</strong> Abc</p>
//             <p><strong>Email ID:</strong> abc@gmail.com</p>
//             <p><strong>Contact:</strong> 8292726378</p>
//           </div>
//         </div>
        
//         <div className="bg-white p-4 rounded-lg shadow mb-6">
//           <h3 className="text-lg font-semibold mb-4">Projects</h3>
//           <Table>
//             <Table.Head>
//               <Table.Row>
//                 <Table.Cell>Project ID</Table.Cell>
//                 <Table.Cell>Project Name</Table.Cell>
//                 <Table.Cell>Start Date</Table.Cell>
//                 <Table.Cell>End Date</Table.Cell>
//                 <Table.Cell>Description</Table.Cell>
//                 <Table.Cell>Action</Table.Cell>
//               </Table.Row>
//             </Table.Head>
//             <Table.Body>
//               {projectData.map((project) => (
//                 <Table.Row key={project.id}>
//                   <Table.Cell>{project.id}</Table.Cell>
//                   <Table.Cell>{project.name}</Table.Cell>
//                   <Table.Cell>{project.startDate}</Table.Cell>
//                   <Table.Cell>{project.endDate}</Table.Cell>
//                   <Table.Cell>{project.description}</Table.Cell>
//                   <Table.Cell>
//                     <Button variant="outline" size="sm" className="mr-2">View Details</Button>
//                     <Button variant="destructive" size="sm">
//                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                       </svg>
//                     </Button>
//                   </Table.Cell>
//                 </Table.Row>
//               ))}
//             </Table.Body>
//           </Table>
//         </div>
        
//         <div className="flex justify-center space-x-4">
//           <Button variant="default" size="lg">+ Add Project</Button>
//           <Button variant="outline" size="lg">View Employees</Button>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default ManagerDashboard;