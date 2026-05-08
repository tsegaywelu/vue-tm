const fs = require('fs');
const path = require('path');

const pathMap = {
  'Dashboard': 'REPORT',
  'ApprovalRequest': 'PAYMENT_REQUEST',
  'Shipment': 'SHIPMENT',
  'Shipments': 'SHIPMENT',
  'PendingBid': 'SHIPMENT',
  'ShipmentAdjustment': 'SHIPMENT',
  'Order': 'ORDER',
  'Orders': 'ORDER',
  'Route': 'ROUTE',
  'Routes': 'ROUTE',
  'Advance': 'ADVANCE_PAYMENT',
  'Settlement': 'TRANSACTION',
  'AggregatedAdvance': 'ADVANCE_PAYMENT',
  'PrePayment': 'PRE_PAYMENT',
  'Customer': 'SHIPPER',
  'Facility': 'FACILITY',
  'Facilities': 'FACILITY',
  'Agent': 'AGENT',
  'Contact': 'CONTACT',
  'Transporter': 'TRANSPORTER',
  'Vehicle': 'VEHICLE',
  'Vehicles': 'VEHICLE',
  'LeasedVehicle': 'VEHICLE_LEASE_AGREEMENT',
  'VehicleType': 'VEHICLE_TYPE',
  'VehicleGoal': 'VEHICLE',
  'VehicleGroup': 'GROUP',
  'VehicleStandard': 'VEHICLE',
  'Insurance': 'INSURANCE',
  'Insurances': 'INSURANCE',
  'ShipmentDamage': 'SHIPMENT_DAMAGE',
  'VehicleDamage': 'VEHICLE_DAMAGE',
  'VehicleTyre': 'TYRE',
  'Tyre': 'TYRE',
  'Mechanic': 'MECHANIC',
  'Inspection': 'INSPECTION',
  'ServiceRecord': 'SERVICE_RECORD',
  'ServiceReminder': 'SERVICE_REMINDER',
  'ServiceTask': 'SERVICE_TASK',
  'ServiceType': 'TYPE',
  'WorkOrder': 'WORK_ORDER',
  'Workshop': 'WORKSHOP',
  'IssueReport': 'ISSUE_REPORT',
  'TyreHandoff': 'TYRE',
  'Payable': 'TRANSACTION',
  'Receivable': 'TRANSACTION',
  'InvoiceReport': 'REPORT',
  'PaymentCollection': 'TRANSACTION',
  'Expense': 'TRANSACTION',
  'ExpenseType': 'EXPENSE_TYPE',
  'FuelTransaction': 'TRANSACTION',
  'DriverBonus': 'DRIVER_BONUS',
  'Driver': 'DRIVER',
  'Drivers': 'DRIVER',
  'Infraction': 'INFRACTION',
  'Infractions': 'INFRACTION',
  'Category': 'CATEGORY',
  'Categories': 'CATEGORY',
  'ItemGroup': 'ITEM_GROUP',
  'Vendor': 'SUPPLIER',
  'Item': 'INVENTORY_ITEM',
  'StoreRequisition': 'STORE_REQUISITION_VOUCHER',
  'PurchaseRequisition': 'PURCHASE_REQUISITION',
  'PurchaseOrder': 'PURCHASE_ORDER',
  'GoodTransfer': 'GOOD_TRANSFER_VOUCHER',
  'UserAndRole': 'USER',
  'User': 'USER',
  'Role': 'ROLE',
  'RoadType': 'ROAD_TYPE',
  'TerrainType': 'TERRAIN_TYPE',
  'Bank': 'BANK',
  'Contract': 'CONTRACT',
  'Commodity': 'COMMODITY',
  'Packaging': 'PACKAGING',
  'RouteRequest': 'ROUTEREGISTER',
  'Region': 'REGION',
  'BonusMultiplier': 'DRIVER_BONUS',
  'BonusRoute': 'DRIVER_BONUS',
  'Announcement': 'ANNOUNCEMENT',
  'Report': 'REPORT',
  'PaidSubContract': 'TRANSACTION'
};

function getSubject(filename) {
  let base = filename.replace('Table.vue', '').replace('.vue', '');
  if (pathMap[base]) return pathMap[base];
  if (base.endsWith('s') && pathMap[base.slice(0, -1)]) return pathMap[base.slice(0, -1)];
  
  const bLow = base.toLowerCase();
  if (bLow.includes('goodtransfer')) return 'GOOD_TRANSFER_VOUCHER';
  if (bLow.includes('purchaserequisition')) return 'PURCHASE_REQUISITION';
  if (bLow.includes('purchaseorder')) return 'PURCHASE_ORDER';
  if (bLow.includes('store')) return 'STORE_REQUISITION_VOUCHER';
  if (bLow.includes('damage')) {
      if (bLow.includes('vehicle')) return 'VEHICLE_DAMAGE';
      if (bLow.includes('shipment')) return 'SHIPMENT_DAMAGE';
  }
  if (bLow.includes('expense')) return 'TRANSACTION';
  if (bLow.includes('payable')) return 'TRANSACTION';
  if (bLow.includes('receivable')) return 'TRANSACTION';
  if (bLow.includes('invoice')) return 'REPORT';
  if (bLow.includes('payment')) return 'TRANSACTION';
  return null;
}

const openActions = {};

function walkSync(currentDirPath, callback) {
    fs.readdirSync(currentDirPath).forEach(function (name) {
        var filePath = path.join(currentDirPath, name);
        var stat = fs.statSync(filePath);
        if (stat.isFile()) {
            callback(filePath, stat);
        } else if (stat.isDirectory()) {
            walkSync(filePath, callback);
        }
    });
}

let modifiedFilesCount = 0;

walkSync('src/modules/operation/components', (filePath) => {
    if (!filePath.endsWith('Table.vue')) return;
    
    const filename = path.basename(filePath);
    const subject = getSubject(filename);
    
    if (!subject) {
       console.warn(`[WARNING] Could not resolve subject for ${filename}. Skipping permissions inject.`);
       return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    // We only care about action buttons inside Dropdown. We can match <button> tags with handleAction or emitAction.
    // To avoid replacing <button> in a way that breaks nested elements, let's parse via regex replacement carefully.
    
    content = content.replace(/<button[\s\S]*?<\/button>/g, (buttonStr) => {
        // If it's already commented out, ignore
        if (buttonStr.includes('v-if="false" <!--')) return buttonStr;
        if (buttonStr.includes('v-permission')) return buttonStr;
        
        let action = null;
        let match = buttonStr.match(/(?:handleAction|emitAction|@click="\w+)\([^,]*?,\s*['"]([^'"]+)['"]/);
        if (!match) {
           // Maybe they pass row and action inline: `@click="...('view')"`
           match = buttonStr.match(/['"](view|edit|delete|approve|reject|cancel|authorize|pay|inspect|edit-status)['"]/);
        }
        
        if (match) {
            action = match[1];
        } else {
            return buttonStr; // Not a known action pattern
        }
        
        // Handle delete
        if (action === 'delete') {
            return `<!-- Delete action commented out temporarily -->\n            <!-- ${buttonStr.replace(/\n/g, '\n            ')} -->`;
        }
        
        // Map to policy action
        let targetAction = null;
        if (action === 'view') targetAction = 'read';
        else if (action === 'edit' || action === 'update') targetAction = 'update';
        else if (action === 'approve') targetAction = 'approve';
        else if (action === 'reject') targetAction = 'reject';
        else if (action === 'cancel') targetAction = 'cancel';
        else if (action === 'authorize') targetAction = 'authorize';
        else if (action === 'pay') targetAction = 'pay';
        else if (action === 'inspect') targetAction = 'inspect';
        else if (action === 'edit-status') {
            if (subject === 'SHIPMENT') targetAction = 'change_status';
            else targetAction = 'update';
        } else {
            // Unmapped, open action
            if (!openActions[filename]) openActions[filename] = new Set();
            openActions[filename].add(action);
            return buttonStr;
        }
        
        // Inject v-permission into the opening <button> tag
        return buttonStr.replace(/<button/, `<button v-permission="'${subject}:${targetAction}'"`);
    });
    
    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        modifiedFilesCount++;
    }
});

// Write open actions to markdown
let md = `# Open Table Actions Review\n\nThe following table actions could not be definitively mapped to a strict legacy permission and have been left completely open. Please review them.\n\n`;
for (const [file, actions] of Object.entries(openActions)) {
    md += `### ${file}\n`;
    for (const act of actions) {
        md += `- \`${act}\`\n`;
    }
    md += '\n';
}

fs.writeFileSync('open_table_actions.md', md);
console.log(`Migration script completed. Modified ${modifiedFilesCount} files.`);
