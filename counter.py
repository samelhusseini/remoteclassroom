import random

from google.appengine.ext import ndb

NUM_SHARDS = 20

class SimpleCounterShard(ndb.Model):
    """Shards for the counter"""
    count = ndb.IntegerProperty(default=0)

def get_count():
    """Retrieve the value for a given sharded counter.

    Returns:
        Integer; the cumulative count of all sharded counters.
    """
    total = 0
    for counter in SimpleCounterShard.query():
        total += counter.count
    return total


@ndb.transactional
def increment():
    """Increment the value for a given sharded counter."""
    shard_string_index = str(random.randint(0, NUM_SHARDS - 1))
    counter = SimpleCounterShard.get_by_id(shard_string_index)
    if counter is None:
        counter = SimpleCounterShard(id=shard_string_index)
    counter.count += 1
    counter.put()