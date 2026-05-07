const fs = require('fs');

let code = fs.readFileSync('src/modules/operation/operation.routes.ts', 'utf8');

const pathMap = [
  { p: 'dashboard', perm: 'REPORT' },
  { p: 'approvals', perm: 'PAYMENT_REQUEST' },
  { p: 'shipment-adjustment', perm: 'SHIPMENT' },
  { p: 'shipments', perm: 'SHIPMENT' },
  { p: 'orders', perm: 'ORDER' },
  { p: 'routes', perm: 'ROUTE' },
  { p: 'advance-details', perm: 'ADVANCE_PAYMENT' },
  { p: 'aggregated-advances', perm: 'ADVANCE_PAYMENT' },
  { p: 'advance-summary', perm: 'ADVANCE_PAYMENT' },
  { p: 'advances', perm: 'ADVANCE_PAYMENT' },
  { p: 'settlements', perm: 'TRANSACTION' },
  { p: 'prepayment-summary', perm: 'PRE_PAYMENT' },
  { p: 'customers', perm: 'SHIPPER' },
  { p: 'facilities', perm: 'FACILITY' },
  { p: 'agents', perm: 'AGENT' },
  { p: 'contacts', perm: 'CONTACT' },
  { p: 'transporters', perm: 'TRANSPORTER' },
  { p: 'vehicles/metrics', perm: 'REPORT' },
  { p: 'vehicles/leased', perm: 'VEHICLE_LEASE_AGREEMENT' },
  { p: 'vehicles/types', perm: 'VEHICLE_TYPE' },
  { p: 'vehicles/goals', perm: 'VEHICLE' },
  { p: 'vehicles/groups', perm: 'GROUP' },
  { p: 'vehicles/standards', perm: 'VEHICLE' },
  { p: 'vehicles', perm: 'VEHICLE' },
  { p: 'insurance/insuranceDetails', perm: 'INSURANCE' },
  { p: 'insurances', perm: 'INSURANCE' },
  { p: 'shipment-damages', perm: 'SHIPMENT_DAMAGE' },
  { p: 'vehicle-damages', perm: 'VEHICLE_DAMAGE' },
  { p: 'vehicle-tyres', perm: 'TYRE' },
  { p: 'mechanic', perm: 'MECHANIC' },
  { p: 'inspection', perm: 'INSPECTION' },
  { p: 'service-record', perm: 'SERVICE_RECORD' },
  { p: 'service-reminder', perm: 'SERVICE_REMINDER' },
  { p: 'service-task', perm: 'SERVICE_TASK' },
  { p: 'service-type', perm: 'TYPE' },
  { p: 'work-order', perm: 'WORK_ORDER' },
  { p: 'workshop', perm: 'WORKSHOP' },
  { p: 'issue-report', perm: 'ISSUE_REPORT' },
  { p: 'tyre-handoffs', perm: 'TYRE' },
  { p: 'payable', perm: 'TRANSACTION' },
  { p: 'receivable', perm: 'TRANSACTION' },
  { p: 'invoice-report', perm: 'REPORT' },
  { p: 'payment-collection', perm: 'TRANSACTION' },
  { p: 'expense-types', perm: 'EXPENSE_TYPE' },
  { p: 'expense', perm: 'TRANSACTION' },
  { p: 'paid-sub-contracts', perm: 'TRANSACTION' },
  { p: 'fuel-transactions', perm: 'TRANSACTION' },
  { p: 'driver-bonuses', perm: 'DRIVER_BONUS' },
  { p: 'drivers', perm: 'DRIVER' },
  { p: 'infractions', perm: 'INFRACTION' },
  { p: 'categories', perm: 'CATEGORY' },
  { p: 'item-groups', perm: 'ITEM_GROUP' },
  { p: 'vendor', perm: 'SUPPLIER' },
  { p: 'items', perm: 'INVENTORY_ITEM' },
  { p: 'store-requisition', perm: 'STORE_REQUISITION_VOUCHER' },
  { p: 'purchase-requisition', perm: 'PURCHASE_REQUISITION' },
  { p: 'purchase-order', perm: 'PURCHASE_ORDER' },
  { p: 'good-transfer', perm: 'GOOD_TRANSFER_VOUCHER' },
  { p: 'user-and-role', perm: 'USER' },
  { p: 'base-configuration/road-type', perm: 'ROAD_TYPE' },
  { p: 'base-configuration/terrain-type', perm: 'TERRAIN_TYPE' },
  { p: 'base-configuration/bank', perm: 'BANK' },
  { p: 'base-configuration/insurance', perm: 'INSURANCE' },
  { p: 'contract', perm: 'CONTRACT' },
  { p: 'commodity', perm: 'COMMODITY' },
  { p: 'packaging', perm: 'PACKAGING' },
  { p: 'route-request', perm: 'ROUTEREGISTER' },
  { p: 'region', perm: 'REGION' },
  { p: 'bonus-multipliers', perm: 'DRIVER_BONUS' },
  { p: 'bonus-routes', perm: 'DRIVER_BONUS' },
  { p: 'announcements', perm: 'ANNOUNCEMENT' },
  { p: 'reports', perm: 'REPORT' }
];

function getPerm(pth) {
  for (const m of pathMap) {
    if (pth === m.p || pth.startsWith(m.p + '/') || pth.startsWith('/' + m.p)) {
      return m.perm;
    }
  }
  return null;
}

// 1. Remove all existing permission keys from meta to avoid duplicates
code = code.replace(/\n\s*permission:\s*['"][^'"]+['"],?/g, '');

// 2. Inject based on path
const blocks = code.split(/path:\s*(['"][^'"]+['"]),/);

let newCode = blocks[0];
for (let i = 1; i < blocks.length; i += 2) {
  const pathStr = blocks[i];
  const rest = blocks[i+1];
  
  const rawPath = pathStr.replace(/['"]/g, '');
  const perm = getPerm(rawPath);
  
  if (perm) {
    const metaIndex = rest.indexOf('meta: {');
    if (metaIndex !== -1) {
      const beforeMeta = rest.substring(0, metaIndex + 'meta: {'.length);
      const afterMeta = rest.substring(metaIndex + 'meta: {'.length);
      newCode += `path: ${pathStr},${beforeMeta}\n          permission: '${perm}',${afterMeta}`;
    } else {
      newCode += `path: ${pathStr},${rest}`;
    }
  } else {
    newCode += `path: ${pathStr},${rest}`;
  }
}

fs.writeFileSync('src/modules/operation/operation.routes.ts', newCode);
console.log('Mapped all routes correctly!');
