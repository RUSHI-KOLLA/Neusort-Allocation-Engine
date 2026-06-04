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

// Test getGarmentStatusSummary - only present statuses are returned
const summary = service.getGarmentStatusSummary();
assert.ok('received' in summary, 'summary should include received');
assert.ok('in_cleaning' in summary, 'summary should include in_cleaning');
assert.ok('ready' in summary, 'summary should include ready');
assert.ok(!('delivered' in summary), 'summary should omit delivered (count is 0)');
assert.strictEqual(summary.received, 1);
assert.strictEqual(summary.in_cleaning, 1);
assert.strictEqual(summary.ready, 1);

// Test getGarmentStatusSummary - counts add up to total garments
const totalFromSummary = Object.values(summary).reduce((a, b) => a + b, 0);
const totalFromOrders = allOrders.reduce((acc, o) => acc + o.garments.length, 0);
assert.strictEqual(totalFromSummary, totalFromOrders, 'summary counts should match total garments');

// Test getGarmentStatusSummary - edge case when no orders exist
const originalOrders = [...allOrders];
service.setOrdersForTesting([]);
const emptySummary = service.getGarmentStatusSummary();
assert.deepStrictEqual(emptySummary, {}, 'summary should be empty if there are no orders');

// Test getGarmentStatusSummary - edgecase where there are orders but no garments
service.setOrdersForTesting([
  {
    id: 'ORD-EMPTY',
    customerName: 'No Garments',
    createdAt: new Date().toISOString(),
    garments: [],
  }
]);
const emptyGarmentsSummary = service.getGarmentStatusSummary();
assert.deepStrictEqual(emptyGarmentsSummary, {}, 'summary should be empty if there are no garments');

// Restore original orders
service.setOrdersForTesting(originalOrders);

console.log('✅ All backend tests passed');
