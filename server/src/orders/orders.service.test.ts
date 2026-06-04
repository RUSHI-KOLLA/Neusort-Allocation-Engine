import assert from 'assert';
import { OrdersService } from './orders.service';

const service = new OrdersService();

// Test findAll
const allOrders = service.findAll();
assert.ok(allOrders.length > 0, 'findAll should return orders');
assert.ok(allOrders[0].totalGarments !== undefined, 'findAll should include totalGarments');
assert.strictEqual(allOrders[0].totalGarments, allOrders[0].garments.length, 'totalGarments should match garments.length');

// Test findOne - existing order
const order = service.findOne('ORD-1001');
assert.ok(order, 'findOne should return order ORD-1001');
assert.strictEqual(order!.id, 'ORD-1001');
assert.ok(order!.totalGarments !== undefined, 'findOne should include totalGarments');

// Test findOne - non-existent order
const missing = service.findOne('ORD-9999');
assert.strictEqual(missing, undefined, 'findOne should return undefined for non-existent ID');

// Test getGarmentStatusSummary - all four statuses present
const summary = service.getGarmentStatusSummary();
assert.ok('received' in summary, 'summary should include received');
assert.ok('in_cleaning' in summary, 'summary should include in_cleaning');
assert.ok('ready' in summary, 'summary should include ready');
assert.ok('delivered' in summary, 'summary should include delivered');
assert.strictEqual(typeof summary.received, 'number');

// Test getGarmentStatusSummary - counts add up to total garments
const totalFromSummary = Object.values(summary).reduce((a, b) => a + b, 0);
const totalFromOrders = allOrders.reduce((acc, o) => acc + o.garments.length, 0);
assert.strictEqual(totalFromSummary, totalFromOrders, 'summary counts should match total garments');

// Test getGarmentStatusSummary - delivered exists even with 0 count (stable zero-count)
assert.strictEqual(summary.delivered, 0, 'delivered should be 0 when no garments have that status');

console.log('✅ All backend tests passed');
