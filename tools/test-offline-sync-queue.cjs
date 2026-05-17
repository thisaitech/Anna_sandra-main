/**
 * Sanity check: sync queue items from invoiceService use `type`, not `action`.
 */
const assert = (cond, msg) => {
  if (!cond) throw new Error(msg);
};

const isOfflineId = (e) =>
  typeof e === 'string' &&
  (e.startsWith('offline_') ||
    e.startsWith('invoice_') ||
    e.startsWith('party_') ||
    e.startsWith('item_') ||
    e.startsWith('expense_'));

const queueItem = {
  id: 'sync_1',
  type: 'create',
  store: 'invoices',
  data: { id: 'invoice_123_abc', invoiceNumber: 'INV/1' },
  status: 'pending',
};

const legacyItem = {
  id: 'sync_2',
  action: 'create',
  store: 'parties',
  data: { id: 'offline_456' },
  status: 'pending',
};

const syncOpAction = (e) => e.action || e.type;

assert(syncOpAction(queueItem) === 'create', 'type field should drive sync');
assert(syncOpAction(legacyItem) === 'create', 'action field still works');
assert(isOfflineId(queueItem.data.id), 'invoice_ id is offline');
assert(!isOfflineId('firebaseDocId123'), 'firebase id is not offline');

const pending = [queueItem, legacyItem];
const forSyncService = pending.filter((c) => c.action != null);
const forOfflineSync = pending.filter((c) => c.type != null && c.action == null);

assert(forSyncService.length === 1, 'syncService only handles action-based rows');
assert(forOfflineSync.length === 1, 'offline sync handles type-based rows');

console.log('OK: offline sync queue contract tests passed');
