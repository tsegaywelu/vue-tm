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
  let base = filename.replace(/(Table|Dropdown|List|Form|Modal|Detail|Details)\.vue$/, '').replace('.vue', '');
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

function mapAction(action, subject) {
    if (action === 'view' || action === 'details') return 'read';
    if (action === 'edit' || action === 'update') return 'update';
    if (action === 'approve') return 'approve';
    if (action === 'reject') return 'reject';
    if (action === 'cancel') return 'cancel';
    if (action === 'authorize') return 'authorize';
    if (action === 'pay') return 'pay';
    if (action === 'inspect') return 'inspect';
    if (action === 'edit-status' || action === 'update_status') {
        if (subject === 'SHIPMENT') return 'change_status';
        return 'update';
    }
    if (action === 'add_voucher') return 'add_voucher';
    if (action === 'create_advance') return 'manage';
    return null;
}

const openActions = {};

function processComponent(content, subject, filename) {
    let originalContent = content;

    // DropDownItem matching
    content = content.replace(/<DropDownItem([\s\S]*?)(\/>|>[\s\S]*?<\/DropDownItem>)/g, (match, attrs, end) => {
        if (match.includes('v-permission')) return match;
        if (match.includes('<!--')) return match;

        let action = null;
        let actMatch = match.match(/(?:handleAction|emitAction|open\w*Modal|emit\(['"]action['"])\([^,]*?,\s*['"]([^'"]+)['"]/);
        if (!actMatch) {
            actMatch = match.match(/['"](view|edit|delete|approve|reject|cancel|authorize|pay|inspect|update_status|add_voucher)['"]/);
        }
        
        if (actMatch) action = actMatch[1];
        else return match;

        if (action === 'delete') {
            return `<!-- Delete action commented out temporarily -->\n        <!-- <DropDownItem${attrs}${end} -->`;
        }

        let targetAction = mapAction(action, subject);
        if (!targetAction) {
            if (!openActions[filename]) openActions[filename] = new Set();
            openActions[filename].add(action);
            return match;
        }

        return `<DropDownItem v-permission="'${subject}:${targetAction}'"${attrs}${end}`;
    });

    // button matching
    content = content.replace(/<button([^>]*?)>([\s\S]*?)<\/button>/g, (match, attrs, inner) => {
        if (match.includes('v-permission')) return match;
        if (match.includes('<!--')) return match;
        
        let action = null;
        let actMatch = match.match(/(?:handleAction|emitAction|@click="\w+)\([^,]*?,\s*['"]([^'"]+)['"]/);
        if (!actMatch) {
            actMatch = match.match(/['"](view|edit|delete|approve|reject|cancel|authorize|pay|inspect|update_status|add_voucher)['"]/);
        }
        
        if (actMatch) action = actMatch[1];
        else return match;

        if (action === 'delete') {
            return `<!-- Delete action commented out temporarily -->\n        <!-- ${match.replace(/\n/g, '\n        ')} -->`;
        }

        let targetAction = mapAction(action, subject);
        if (!targetAction) {
            if (!openActions[filename]) openActions[filename] = new Set();
            openActions[filename].add(action);
            return match;
        }

        return `<button v-permission="'${subject}:${targetAction}'"${attrs}>${inner}</button>`;
    });

    return content;
}

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
    if (!filePath.endsWith('.vue')) return;
    
    const filename = path.basename(filePath);
    const subject = getSubject(filename);
    
    if (!subject) return; // Ignore components we can't map
    
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    content = processComponent(content, subject, filename);
    
    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        modifiedFilesCount++;
    }
});

let md = `# Open Table Actions Review\n\nThe following actions did not map directly to standard CRUD permissions and have been left open:\n\n`;
for (const [file, actions] of Object.entries(openActions)) {
    md += `### ${file}\n`;
    for (const act of actions) {
        md += `- \`${act}\`\n`;
    }
    md += '\n';
}
fs.writeFileSync('open_table_actions.md', md);
console.log(`Migration script completed. Modified ${modifiedFilesCount} files.`);
