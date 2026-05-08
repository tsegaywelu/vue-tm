const fs = require('fs');

const path = './src/modules/operation/operation.routes.ts';
let content = fs.readFileSync(path, 'utf8');

const mapping = {
  'operation_shipments': 'SHIPMENT',
  'operation_orders': 'ORDER',
  'operation_routes': 'ROUTE',
  'operation_advances': 'ADVANCE_PAYMENT',
  'operation_settlements': 'TRANSACTION',
  'operation_advance_summary': 'ADVANCE_PAYMENT',
  'operation_prepayment_summary': 'ADVANCE_PAYMENT',
  'operation_customers': 'SHIPPER',
  'operation_facilities': 'FACILITY',
  'operation_agents': 'AGENT',
  'operation_contacts': 'CONTACT',
  'operation_transporters': 'TRANSPORTER',
  'operation_vehicles': 'VEHICLE',
  'operation_leased_vehicles': 'VEHICLE_LEASE_AGREEMENT',
  'operation_vehicle_types': 'VEHICLE_TYPE',
  'operation_vehicle_groups': 'GROUP',
  'operation_insurances': 'INSURANCE',
  'operation_shipment_damages': 'SHIPMENT_DAMAGE',
  'operation_vehicle_damages': 'VEHICLE_DAMAGE',
  'operation_maintenance_mechanic': 'MECHANIC',
  'operation_maintenance_inspection': 'INSPECTION',
  'operation_maintenance_service_record': 'SERVICE_RECORD',
  'operation_maintenance_service_reminder': 'SERVICE_REMINDER',
  'operation_maintenance_service_task': 'SERVICE_TASK',
  'operation_maintenance_work_order': 'WORK_ORDER',
  'operation_maintenance_workshop': 'WORKSHOP',
};

// Exact match
for (const [routeName, permission] of Object.entries(mapping)) {
  const regex2 = new RegExp(`name:\\s*['"]${routeName}['"][\\s\\S]*?meta:\\s*\\{[\\s\\S]*?\\}`);
  const match = content.match(regex2);
  if (match && !match[0].includes('permission:')) {
     content = content.replace(regex2, (m) => {
         return m.replace(/(\n\s*)(\})$/, `$1  permission: '${permission}',$1$2`);
     });
  }
}

// Child match (e.g. operation_shipments_add)
for (const [routeName, permission] of Object.entries(mapping)) {
  const regex2 = new RegExp(`name:\\s*['"]${routeName}_[\\w]+['"][\\s\\S]*?meta:\\s*\\{[\\s\\S]*?\\}`, 'g');
  content = content.replace(regex2, (m) => {
     if (!m.includes('permission:')) {
         return m.replace(/(\n\s*)(\})$/, `$1  permission: '${permission}',$1$2`);
     }
     return m;
  });
}

fs.writeFileSync(path, content, 'utf8');
console.log('Routes updated!');
