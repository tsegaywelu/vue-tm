export function generateRouteCode(shipment: any): string {
  if (shipment.route?.routeCode) return shipment.route.routeCode;
  if (shipment.order?.route?.routeCode) return shipment.order.route.routeCode;
  if (shipment.routeCode) return shipment.routeCode;

  const agentName = shipment.agent?.name || shipment.order?.agent?.name || "";
  const origin = shipment.route?.origin || shipment.routeOrigin || "";
  const destination = shipment.route?.destination || shipment.routeDestination || "";
  if (!origin && !destination) return "";

  let code = "D";
  if (agentName.includes(" ")) {
    const [first, last] = agentName.split(" ");
    code += first.substring(0, 2).toUpperCase() + last.substring(0, 1).toUpperCase();
  } else {
    code += agentName.substring(0, 3).toUpperCase();
  }
  code += "_" + origin.substring(0, 1).toUpperCase() + destination.substring(0, 4).toUpperCase();
  return code;
}

function capitalize(str: string): string {
  return str.replace(/\b\w/g, (c) => c.toUpperCase()).replace(/\B\w/g, (c) => c.toLowerCase());
}

export function getBusinessUnit(shipment: any): string {
  return capitalize(shipment.route?.origin || shipment.routeOrigin || "");
}

export function getMaterialType(shipment: any): string {
  const list = shipment.commodity?.length > 0 ? shipment.commodity : shipment.order?.commodity;
  return Array.isArray(list) && list.length > 0 ? (list[0].name || list[0]) : "";
}

export function getOrigin(shipment: any): string {
  return capitalize(shipment.route?.origin || shipment.routeOrigin || "");
}

export function getDestination(shipment: any): string {
  return capitalize(shipment.route?.destination || shipment.routeDestination || "");
}

export function getRouteDescription(shipment: any, separator = " - "): string {
  const o = getOrigin(shipment);
  const d = getDestination(shipment);
  return o || d ? `${o}${separator}${d}` : "";
}
