export interface ArchStep {
  title: string;
  detail: string;
}

export interface SDSection {
  heading: string;
  body: string;
  bullets?: string[];
}

export interface SystemDesignTopic {
  id: string;
  slug: string;
  title: string;
  type: 'fundamental' | 'case-study';
  category: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  summary: string;
  description: string;
  keyPoints: string[];
  architecture: ArchStep[];
  sections: SDSection[];
  tradeoffs?: { pros: string[]; cons: string[] };
  pitfalls: string[];
  interviewTips: string[];
  relatedSlugs: string[];
  tags: string[];
}

export const systemDesignTopics: SystemDesignTopic[] = [
  // ============================================================
  // FUNDAMENTALS
  // ============================================================
  {
    id: 'sd-framework',
    slug: 'system-design-interview-framework',
    title: 'The System Design Interview Framework',
    type: 'fundamental',
    category: 'Interview Skills',
    summary: 'A repeatable four-step process for tackling any open-ended system design question.',
    description:
      'Most system design interviews reward structure over cleverness. Interviewers are watching how you scope an ambiguous problem, trade off constraints, and communicate — not whether you recall a specific architecture. This framework gives you a repeatable path through any prompt, from "design Twitter" to "design a rate limiter."',
    keyPoints: [
      'Never start designing before you have scoped requirements — ambiguity is the test',
      'Budget your time: ~5 min requirements, ~5 min estimation, ~15-20 min high-level design, ~15 min deep dive, ~5 min wrap-up',
      'State assumptions out loud so the interviewer can redirect you early',
      'Design for the common case first, then layer in edge cases and failure handling',
      'A working simple design beats an ambitious broken one — start simple, then iterate',
    ],
    architecture: [
      { title: '1. Clarify requirements', detail: 'Separate functional requirements (what the system does) from non-functional ones (scale, latency, consistency, availability). Ask about read/write ratio, expected users, and which features are in scope.' },
      { title: '2. Estimate scale', detail: 'Back-of-envelope the QPS, storage, and bandwidth. These numbers decide whether you need a single database or a sharded, cached, globally distributed system.' },
      { title: '3. Define the API', detail: 'Sketch the core endpoints or method signatures. This forces you to nail down entities and forces early agreement with the interviewer on scope.' },
      { title: '4. High-level design', detail: 'Draw boxes: clients, load balancer, services, cache, database, queue. Walk through one or two core user flows end-to-end through the diagram.' },
      { title: '5. Deep dive', detail: 'The interviewer will steer you into 1-2 components that need real depth — usually the data model, a scaling bottleneck, or a consistency concern. This is where most of the signal is generated.' },
      { title: '6. Identify bottlenecks & wrap up', detail: 'Call out single points of failure, hot spots, and what breaks at 10x scale. Propose fixes: caching, sharding, replication, async processing.' },
    ],
    sections: [
      {
        heading: 'Functional vs. non-functional requirements',
        body: 'Functional requirements describe user-visible behavior ("users can post a tweet"). Non-functional requirements describe system qualities that shape the architecture far more than features do.',
        bullets: [
          'Scale: how many users, requests/sec, and data volume?',
          'Latency: what response time is acceptable (p50/p99)?',
          'Consistency: can reads be slightly stale, or must they be immediate?',
          'Availability: is downtime tolerable, or must it be five-nines?',
          'Durability: can any data be lost?',
        ],
      },
      {
        heading: 'Why interviewers care about the process, not the answer',
        body: 'There is rarely one "correct" architecture. A candidate who says "I will use Cassandra because it is web-scale" without justifying the choice against the stated requirements is a red flag. A candidate who says "we need high write throughput with eventual consistency, so a wide-column store like Cassandra fits better than a relational database here" demonstrates the actual skill being tested.',
      },
      {
        heading: 'Common structure to fall back on',
        body: 'When stuck, walk through the request path: client → DNS → load balancer → API gateway → service → cache → database. Ask at each hop: does this need to scale independently? Can it fail without taking down the whole system? Is this the right place for a cache?',
      },
    ],
    tradeoffs: {
      pros: [
        'Keeps a 45-minute conversation structured and prevents rabbit holes',
        'Surfaces the constraints that actually determine the architecture',
        'Gives the interviewer natural points to redirect you toward what they want to probe',
      ],
      cons: [
        'Can feel mechanical if followed too rigidly instead of adapting to the conversation',
        'Spending too long on estimation or API design leaves no time for the deep dive that carries the most signal',
      ],
    },
    pitfalls: [
      'Jumping straight to a detailed architecture before requirements are clear',
      'Designing for scale the requirements never asked for ("premature Kafka")',
      'Silence — not narrating your reasoning out loud while you think',
      'Treating the deep dive as optional and running out of time before reaching it',
    ],
    interviewTips: [
      'Write requirements and numbers on the board/doc first — they become your justification for every later decision',
      'Ask "should I go deeper on X or Y?" near the end of the high-level design to hand control to the interviewer',
      'It is fine to explicitly defer a concern: "I will assume single-region for now and revisit multi-region if we have time."',
    ],
    relatedSlugs: ['back-of-envelope-estimation', 'scaling-fundamentals'],
    tags: ['interview', 'framework', 'process', 'requirements'],
  },
  {
    id: 'sd-estimation',
    slug: 'back-of-envelope-estimation',
    title: 'Back-of-the-Envelope Estimation',
    type: 'fundamental',
    category: 'Interview Skills',
    summary: 'Quick capacity math — QPS, storage, and bandwidth — that determines your entire architecture.',
    description:
      'Before you can decide whether you need a cache, how many database shards to use, or whether a single server can handle the load, you need rough numbers. Precision does not matter; order of magnitude does. These estimates are what justify every architectural decision that follows.',
    keyPoints: [
      'Round aggressively — 86,400 seconds/day becomes ~100k; you are estimating orders of magnitude, not billing invoices',
      'Compute QPS from daily active users × actions per user, then divide by seconds in a day',
      'Peak QPS is typically 2-3x average QPS — always design for peak, not average',
      'Storage = records/day × size/record × retention period; always sanity-check against real hardware capacity',
      'A single well-provisioned server today handles roughly 1k-10k requests/sec and terabytes of disk — anything asking for more than that per node needs horizontal scaling',
    ],
    architecture: [
      { title: '1. Traffic estimate', detail: 'DAU × requests per user per day ÷ 86,400s = average QPS. Multiply by 2-3x for peak QPS.' },
      { title: '2. Storage estimate', detail: 'New records/day × average size per record × retention (days/years) = total storage, then add a replication factor (typically 3x).' },
      { title: '3. Bandwidth estimate', detail: 'QPS × average payload size gives ingress/egress bandwidth; multiply by object size for media-heavy systems (e.g. video, images).' },
      { title: '4. Memory / cache estimate', detail: 'Apply the 80/20 rule: if 20% of daily unique objects account for 80% of reads, size your cache to hold that hot 20% in RAM.' },
      { title: '5. Server count estimate', detail: 'Peak QPS ÷ QPS a single server can sustain (measured or assumed, e.g. 1,000 req/s) gives a rough fleet size, then add headroom for failover.' },
    ],
    sections: [
      {
        heading: 'Useful numbers to memorize',
        bullets: [
          '1 day ≈ 100,000 seconds (86,400, rounded)',
          '1 million requests/day ≈ 12 QPS average',
          'L1 cache reference: ~1 ns · RAM reference: ~100 ns · SSD random read: ~100 μs · Round trip within a datacenter: ~500 μs · Round trip cross-continent: ~150 ms',
          'A single relational DB node comfortably handles low thousands of QPS and low terabytes of data before it needs sharding',
        ],
        body: '',
      },
      {
        heading: 'Worked example: URL shortener',
        body: 'Assume 100M new URLs/month and a 100:1 read:write ratio. Writes: 100M ÷ 2.6M sec/month ≈ 40 writes/sec. Reads: 40 × 100 = 4,000 reads/sec. Storage: 100M/month × 12 months × 5 years × ~500 bytes/record ≈ 3 TB before replication — small enough for a single sharded relational cluster, and the read load screams "put a cache in front of the redirect path."',
      },
      {
        heading: 'What the numbers decide for you',
        body: 'Low QPS and small storage: a single database and a load-balanced stateless service tier is enough — do not over-engineer. High read QPS relative to writes: add a cache layer. Storage in the tens of terabytes or beyond: plan for sharding. Very high write throughput: consider a log-structured store or a message queue to absorb bursts.',
      },
    ],
    pitfalls: [
      'Spending five minutes computing exact numbers instead of clean round ones — the interviewer wants the reasoning, not a calculator',
      'Forgetting to account for peak traffic, replication overhead, or metadata/index size when estimating storage',
      'Producing a number and never using it to justify a design decision afterward',
    ],
    interviewTips: [
      'Say the formula out loud before plugging in numbers — it shows the reasoning, not just an answer',
      'Always connect the estimate back to a decision: "4,000 reads/sec on one table means we need a cache in front of it."',
    ],
    relatedSlugs: ['system-design-interview-framework', 'scaling-fundamentals'],
    tags: ['interview', 'estimation', 'capacity planning', 'QPS'],
  },
  {
    id: 'sd-scaling',
    slug: 'scaling-fundamentals',
    title: 'Scaling Fundamentals',
    type: 'fundamental',
    category: 'Scalability',
    summary: 'From one server to a fleet: load balancers, statelessness, and the building blocks behind every large system.',
    description:
      'Almost every large-scale system diagram is built from the same handful of primitives, assembled differently. Understanding these building blocks — and why each one gets added — lets you construct a plausible architecture for nearly any prompt.',
    keyPoints: [
      'Vertical scaling (bigger machine) is simple but hits a hard ceiling and has no redundancy',
      'Horizontal scaling (more machines) has no theoretical ceiling but requires the service to be stateless',
      'Statelessness lets a load balancer route any request to any server, which is what makes horizontal scaling and autoscaling possible',
      'Once you have more than one server, you need a load balancer, and once you have a load balancer, you need to get session state out of the app server (DB, cache, or client-side token)',
      'Every layer added (LB, cache, replica, queue) trades complexity for capacity — do not add a layer the requirements do not justify',
    ],
    architecture: [
      { title: '1. Single server', detail: 'Web server, app, and database all live on one box. Fine for a prototype; a single point of failure and a hard capacity ceiling.' },
      { title: '2. Separate the database', detail: 'Move the DB to its own host so the web/app tier and data tier scale independently.' },
      { title: '3. Add more app servers + a load balancer', detail: 'The LB distributes traffic across a fleet, giving both capacity and redundancy — if one server dies, the LB routes around it.' },
      { title: '4. Make the app tier stateless', detail: 'Move session data out of local memory into a shared store (Redis, DB, or a signed client-side token) so any server can handle any request.' },
      { title: '5. Add a cache', detail: 'Place a cache (in-memory or CDN) in front of expensive reads to cut database load and latency.' },
      { title: '6. Replicate and shard the database', detail: 'Read replicas scale read throughput; sharding scales write throughput and storage beyond one node.' },
      { title: '7. Introduce a message queue', detail: 'Decouple slow or bursty work (email, video processing, notifications) from the request path so it can be processed asynchronously and retried on failure.' },
      { title: '8. Add multiple data centers + a CDN', detail: 'Serve static assets and, eventually, entire regions from geographically distributed nodes to cut latency and survive a regional outage.' },
    ],
    sections: [
      {
        heading: 'Stateless vs. stateful services',
        body: 'A stateless service keeps no client-specific data between requests — everything needed is either in the request itself or fetched from a shared store. This is the single most important property for horizontal scaling, because it means every server is interchangeable and the load balancer is free to route however it wants (round robin, least connections, etc.) without breaking a session.',
        bullets: [
          'Stateful: session data lives in server memory → that user must always hit the same server (sticky sessions), which limits load balancing and complicates failover',
          'Stateless: session data lives in Redis/DB or a signed JWT → any server can serve any request',
        ],
      },
      {
        heading: 'Load balancing strategies',
        body: 'A load balancer sits between clients and the server fleet, distributing requests and health-checking backends.',
        bullets: [
          'Round robin — simple, ignores server load, can overload a slow node',
          'Least connections — routes to the server with the fewest active connections, better under uneven request costs',
          'Weighted / consistent hashing — routes by a key (e.g. user ID) so the same client tends to hit the same backend, useful for cache locality',
          'Layer 4 (transport) LBs are fast and protocol-agnostic; Layer 7 (application) LBs can route on URL path, headers, or cookies but cost more CPU per request',
        ],
      },
      {
        heading: 'Data center redundancy and CDNs',
        body: 'Once traffic is global, a single data center adds latency for distant users and is a single point of failure for the whole system. A CDN caches static and semi-static content at edge locations close to users; GeoDNS or an anycast LB routes users to their nearest healthy data center for everything else.',
      },
    ],
    tradeoffs: {
      pros: [
        'Each layer (LB, cache, replica, queue) can be scaled or replaced independently',
        'No single component failing takes down the whole system once redundancy is added',
        'Statelessness enables autoscaling — add or remove capacity based on real-time load',
      ],
      cons: [
        'More moving parts means more operational and monitoring overhead',
        'Distributed state (cache invalidation, replication lag) introduces its own class of bugs',
        'Adding infrastructure ahead of actual load is wasted cost and complexity',
      ],
    },
    pitfalls: [
      'Keeping session state in server memory and then trying to add a second server',
      'Adding a load balancer without first removing server-side state, causing sticky-session bugs',
      'Scaling the app tier while leaving a single database as the bottleneck',
    ],
    interviewTips: [
      'Narrate the "why" for each box you add — "I am adding a cache here because the read:write ratio is 100:1"',
      'Explicitly call out single points of failure once the diagram is drawn, then fix the most important one',
    ],
    relatedSlugs: ['caching-strategies', 'database-replication-sharding', 'message-queues-async'],
    tags: ['load balancing', 'stateless', 'horizontal scaling', 'CDN', 'high availability'],
  },
  {
    id: 'sd-caching',
    slug: 'caching-strategies',
    title: 'Caching Strategies',
    type: 'fundamental',
    category: 'Performance',
    summary: 'Cache-aside, write-through, write-back, and the eviction policies that keep a cache useful.',
    description:
      'A cache trades a small amount of staleness risk for a large reduction in latency and database load. The strategy you pick determines the consistency guarantees between the cache and the source of truth, and the eviction policy determines what stays in a memory budget that is always smaller than the dataset.',
    keyPoints: [
      'Cache-aside (lazy loading) is the most common pattern: the application checks the cache first and populates it on a miss',
      'Write-through keeps the cache always consistent with the DB at the cost of extra write latency',
      'Write-back (write-behind) is the fastest for writes but risks data loss if the cache node fails before flushing',
      'TTLs bound staleness for cache-aside; explicit invalidation is needed when data changes must be reflected immediately',
      'LRU is the default eviction policy; LFU suits workloads with a stable "hot set"; a cache with no eviction policy is just a memory leak',
    ],
    architecture: [
      { title: '1. Request arrives', detail: 'The application receives a read request for a key (e.g. a user profile or product page).' },
      { title: '2. Check the cache', detail: 'Look up the key in the cache (Redis/Memcached). On a hit, return immediately — this is the fast path that should serve the vast majority of reads.' },
      { title: '3. Cache miss → read from DB', detail: 'On a miss, query the database for the value.' },
      { title: '4. Populate the cache', detail: 'Write the fetched value into the cache with a TTL before returning it to the caller, so the next request is a hit.' },
      { title: '5. Handle writes', detail: 'On update, either invalidate the cached key (cache-aside), update DB and cache together (write-through), or update the cache and asynchronously flush to DB (write-back).' },
      { title: '6. Evict under memory pressure', detail: 'When the cache is full, the eviction policy (LRU/LFU) picks a victim key to remove to make room for new entries.' },
    ],
    sections: [
      {
        heading: 'The three write strategies',
        bullets: [
          'Cache-aside: app owns the logic — read-populate on miss, invalidate-on-write. Simple and resilient to cache failures (worst case: fall back to DB), but the cache can be briefly stale between a DB write and the next read.',
          'Write-through: every write goes to the cache and DB synchronously. Cache is never stale, but every write pays the latency of both stores, and rarely-read data still consumes cache space.',
          'Write-back: writes go to the cache first and are flushed to the DB asynchronously in batches. Very low write latency and fewer DB writes, but a cache node crash before flush loses data — needs replication or a WAL to be safe.',
        ],
        body: '',
      },
      {
        heading: 'Eviction policies',
        bullets: [
          'LRU (Least Recently Used) — evicts the item not accessed for the longest time; good general-purpose default, implemented with a hash map + doubly linked list for O(1) get/put',
          'LFU (Least Frequently Used) — evicts the item accessed least often; better when popularity is stable over time (e.g. trending content), but slower to adapt to shifting access patterns',
          'TTL-based expiry — items expire after a fixed duration regardless of access pattern; simple and predictable, commonly combined with LRU',
        ],
        body: '',
      },
      {
        heading: 'Where to cache',
        body: 'Caching happens at every layer of the stack, and a well-designed system usually uses several at once: the browser/CDN caches static assets closest to the user; an API/application cache (Redis) sits in front of the database for computed or frequently read data; and the database itself has an internal buffer pool cache. Each layer reduces load on the one behind it.',
      },
      {
        heading: 'Cache invalidation — the hard part',
        body: 'Phil Karlton\'s line still holds: "There are only two hard things in Computer Science: cache invalidation and naming things." Common approaches are TTL expiry (simple, bounded staleness), explicit delete-on-write (correct but requires finding every cache key that depends on the changed data), and versioned/namespaced keys (bump a version number to invalidate a whole family of keys at once).',
      },
    ],
    tradeoffs: {
      pros: [
        'Order-of-magnitude latency reduction for hot reads (RAM vs. disk/network)',
        'Shields the database from read load, letting it handle more write traffic',
        'Can absorb traffic spikes that would otherwise overwhelm the origin store',
      ],
      cons: [
        'Introduces staleness — cached data can lag the source of truth',
        'Adds an extra component that can fail or become its own bottleneck (a "cache stampede" on a cold cache is a classic outage cause)',
        'Invalidation logic is easy to get subtly wrong, leading to serving stale data indefinitely',
      ],
    },
    pitfalls: [
      'Caching everything with no eviction policy or TTL, turning the cache into an unbounded memory leak',
      'Not handling a "thundering herd" — many requests missing the same hot key simultaneously and all hammering the DB at once (fix: request coalescing or a short lock on the key while it repopulates)',
      'Forgetting to invalidate the cache on writes, silently serving stale data',
    ],
    interviewTips: [
      'Justify cache placement with the read:write ratio from your estimation step, not by default',
      'Mention TTL choice explicitly — it is a direct trade between staleness and DB load',
    ],
    relatedSlugs: ['scaling-fundamentals', 'database-replication-sharding', 'url-shortener'],
    tags: ['cache', 'LRU', 'redis', 'cache-aside', 'write-through', 'CDN'],
  },
  {
    id: 'sd-db-scaling',
    slug: 'database-replication-sharding',
    title: 'Database Replication & Sharding',
    type: 'fundamental',
    category: 'Data & Storage',
    summary: 'Scaling reads with replicas and scaling writes and storage with sharding.',
    description:
      'A single database server eventually runs out of either read capacity, write capacity, or disk space. Replication and sharding are the two orthogonal techniques that address these limits — and most large systems need both.',
    keyPoints: [
      'Replication copies the same data to multiple nodes to scale reads and provide failover — it does not help write throughput or storage capacity',
      'Sharding (partitioning) splits data across nodes by a key, scaling writes and storage — but makes cross-shard queries and joins expensive',
      'Master-slave replication is simple but the master is a write bottleneck and a single point of failure until a replica is promoted',
      'Choosing a good shard key is the single most important sharding decision — a bad key creates hot shards',
      'Resharding a live system is one of the hardest operational problems in distributed systems; consistent hashing minimizes the data that must move',
    ],
    architecture: [
      { title: '1. Client writes', detail: 'Writes go to the primary (master) node, which is the single source of truth for its data.' },
      { title: '2. Replication', detail: 'The primary asynchronously (or synchronously) streams its write-ahead log to one or more replicas.' },
      { title: '3. Reads fan out', detail: 'Read traffic is load-balanced across replicas, multiplying read capacity; the app tolerates a small replication lag or routes read-your-write requests to the primary.' },
      { title: '4. Failover', detail: 'If the primary dies, a monitoring/consensus system (e.g. a Raft group or a manager like ZooKeeper) promotes a replica to primary and reroutes writes.' },
      { title: '5. Sharding by key', detail: 'Independently, the dataset is partitioned by a shard key (e.g. user_id) using range or hash partitioning, so each shard holds a slice of the data and handles its own write load.' },
      { title: '6. Routing layer', detail: 'A routing tier or client-side library maps a shard key to the correct shard for both reads and writes.' },
    ],
    sections: [
      {
        heading: 'Replication topologies',
        bullets: [
          'Master-slave (primary-replica): all writes go to one primary; replicas serve reads. Simple, but writes cannot scale past one node.',
          'Master-master: multiple nodes accept writes, replicating to each other. Higher write availability, but conflict resolution (two nodes writing the same key) becomes a real problem.',
          'Synchronous replication guarantees no data loss on failover but adds write latency; asynchronous replication is fast but can lose the last few writes if the primary crashes before replicating them.',
        ],
        body: '',
      },
      {
        heading: 'Sharding strategies',
        bullets: [
          'Range-based sharding — contiguous key ranges per shard (e.g. A-M, N-Z); simple and supports range queries, but prone to hot spots if the key distribution or access pattern is skewed.',
          'Hash-based sharding — hash(key) % N picks the shard; spreads load evenly but breaks range queries and requires resharding all data if N changes.',
          'Consistent hashing — hashes both keys and shards onto a ring, so adding or removing a shard only remaps a fraction of keys instead of nearly all of them. See the dedicated consistent hashing topic.',
          'Directory-based sharding — a lookup service maps keys to shards explicitly; flexible (supports resharding without a rehash formula) but the directory becomes a new dependency and potential bottleneck.',
        ],
        body: '',
      },
      {
        heading: 'The cost of sharding: cross-shard operations',
        body: 'Once data is split across shards, operations that used to be a single-node query (a join, a transaction across two rows, a global count) now require fan-out to multiple shards and merging results in the application layer, or a distributed transaction protocol (two-phase commit) which adds latency and complexity. Good shard key selection — one that keeps related data (e.g. all of one user\'s data) on the same shard — avoids most cross-shard queries.',
      },
    ],
    tradeoffs: {
      pros: [
        'Replication multiplies read throughput near-linearly and provides failover',
        'Sharding removes the single-node ceiling on both write throughput and storage',
        'Each shard/replica can be scaled and even geographically placed independently',
      ],
      cons: [
        'Replication lag means replicas can serve stale reads',
        'A poorly chosen shard key creates hot shards that defeat the purpose of sharding',
        'Cross-shard joins, transactions, and aggregations are slow or require application-level orchestration',
        'Resharding a live cluster is operationally risky and, without consistent hashing, moves most of the data',
      ],
    },
    pitfalls: [
      'Sharding by a monotonically increasing key like a timestamp, which sends all new writes to the same "last" shard',
      'Ignoring replication lag and assuming a read right after a write will see it (the "read-your-writes" problem)',
      'Treating a replica as a backup — a corrupted or accidentally deleted row on the primary replicates to every replica too',
    ],
    interviewTips: [
      'When asked to shard something, always ask/state what the shard key is and justify it against the access pattern',
      'Distinguish clearly: replication solves read scale and availability; sharding solves write scale and storage',
    ],
    relatedSlugs: ['consistent-hashing', 'cap-theorem-consistency', 'key-value-store'],
    tags: ['database', 'sharding', 'replication', 'partitioning', 'scalability'],
  },
  {
    id: 'sd-consistent-hashing',
    slug: 'consistent-hashing',
    title: 'Consistent Hashing',
    type: 'fundamental',
    category: 'Data & Storage',
    summary: 'A hashing scheme that keeps remapping minimal when nodes are added or removed from a distributed system.',
    description:
      'Plain hash(key) % N works fine until N changes. Add or remove a single server, and modulo hashing remaps almost every key — invalidating nearly an entire cache or requiring a massive data shuffle. Consistent hashing solves exactly this problem, and it is the technique behind sharding, distributed caches, and load balancers like DynamoDB, Cassandra, and CDN routing.',
    keyPoints: [
      'Both servers and keys are hashed onto the same fixed circular space (a "ring"), typically 0 to 2^32-1',
      'A key belongs to the first server found walking clockwise from the key\'s position on the ring',
      'Adding or removing one server only remaps the keys between it and its predecessor — roughly 1/N of all keys, not all of them',
      'Naive consistent hashing can still be unbalanced with few nodes; virtual nodes fix this by mapping each physical server to many points on the ring',
      'Used in DynamoDB, Cassandra, Riak, Discord, and CDN request routing',
    ],
    architecture: [
      { title: '1. Build the ring', detail: 'Pick a hash function (e.g. MD5/MurmurHash) and treat its output space as a circle from 0 to 2^32-1.' },
      { title: '2. Place servers on the ring', detail: 'Hash each server\'s ID (or many virtual-node IDs per server) to get its position(s) on the ring.' },
      { title: '3. Place a key', detail: 'To find which server owns a key, hash the key to get a ring position, then walk clockwise to the first server position found.' },
      { title: '4. Add a server', detail: 'The new server takes ownership of the arc of keys between itself and the previous server clockwise from it — only those keys need to move.' },
      { title: '5. Remove a server', detail: 'Its keys are reassigned to the next server clockwise; every other server\'s ownership is untouched.' },
      { title: '6. Virtual nodes for balance', detail: 'Each physical server is hashed to e.g. 100-200 points around the ring instead of one, so both load and the redistribution on scaling events are spread evenly across all remaining servers.' },
    ],
    sections: [
      {
        heading: 'Why virtual nodes matter',
        body: 'With only a handful of physical servers hashed once each, the arcs they own can be wildly uneven by chance — one server might own 60% of the ring, another 5%. Hashing each physical server to many virtual points spreads its ownership across many small arcs distributed around the ring, averaging out to near-uniform load and making the impact of adding/removing a node proportional across all remaining servers rather than concentrated on one neighbor.',
      },
      {
        heading: 'Consistent hashing vs. modulo hashing',
        bullets: [
          'Modulo (hash(key) % N): O(1) lookup, but changing N remaps ~(N-1)/N of all keys — a cluster resize is effectively a full data migration',
          'Consistent hashing: lookup requires walking/searching the ring (O(log N) with a sorted structure), but changing the cluster size remaps only ~1/N of keys',
          'The trade is: slightly more lookup complexity in exchange for dramatically cheaper scaling events',
        ],
        body: '',
      },
      {
        heading: 'Real-world use',
        body: 'Amazon DynamoDB and Apache Cassandra use consistent hashing to distribute partitions across nodes, replicating each key to the next N-1 servers clockwise on the ring for fault tolerance. CDNs and some load balancers use it to route the same client (or cache key) to the same backend consistently, maximizing cache hit rates even as the backend fleet scales up and down.',
      },
    ],
    tradeoffs: {
      pros: [
        'Minimal data movement when the cluster scales up or down',
        'Enables independent, incremental horizontal scaling of stateful services',
        'Virtual nodes give good load balance even with few physical machines',
      ],
      cons: [
        'More complex to implement and reason about than a modulo hash',
        'Still requires care to handle heterogeneous server capacity (weight virtual node counts accordingly)',
        'Range queries are not naturally supported since keys are scattered by hash, not sorted by value',
      ],
    },
    pitfalls: [
      'Using consistent hashing without virtual nodes, then being surprised load is uneven',
      'Forgetting that consistent hashing balances placement, not popularity — a single "celebrity" key can still overload the one node that owns it',
      'Not replicating each key to multiple nodes (N-1 successors on the ring), leaving no fault tolerance if one node fails',
    ],
    interviewTips: [
      'Draw the ring — it is one of the few system design diagrams that is genuinely clarifying to sketch live',
      'Always mention virtual nodes when proposing consistent hashing; omitting them is a common gap interviewers probe for',
    ],
    relatedSlugs: ['database-replication-sharding', 'key-value-store'],
    tags: ['consistent hashing', 'distributed systems', 'sharding', 'load balancing'],
  },
  {
    id: 'sd-cap',
    slug: 'cap-theorem-consistency',
    title: 'CAP Theorem & Consistency Models',
    type: 'fundamental',
    category: 'Reliability',
    summary: 'Why you can only pick two of Consistency, Availability, and Partition Tolerance — and what that means in practice.',
    description:
      'CAP theorem is one of the most cited — and most misunderstood — ideas in distributed systems. Understanding it correctly, and knowing the finer-grained consistency models underneath it, is what separates a candidate who can justify a database choice from one who is just naming buzzwords.',
    keyPoints: [
      'Network partitions will happen in any real distributed system, so partition tolerance (P) is not really optional — the real choice is between Consistency (C) and Availability (A) during a partition',
      'CP systems (e.g. HBase, MongoDB in default config, ZooKeeper) reject requests they cannot guarantee are consistent, sacrificing availability during a partition',
      'AP systems (e.g. Cassandra, DynamoDB, CouchDB) keep serving reads and writes during a partition, accepting that different nodes may temporarily disagree',
      'Strong consistency means every read sees the latest write; eventual consistency means reads may be stale but will converge given enough time with no new writes',
      'CAP describes behavior only during a network partition — most of the time, well-designed systems can be both fast and consistent',
    ],
    architecture: [
      { title: '1. Normal operation', detail: 'All nodes can communicate; writes replicate and reads return current data. Both consistency and availability hold.' },
      { title: '2. Partition occurs', detail: 'A network failure splits the cluster into two groups that cannot talk to each other, but each group can still see client requests.' },
      { title: '3. A write arrives at one side', detail: 'Node A (in one partition group) receives a write. It cannot confirm the other side has the same data.' },
      { title: '4. The system must choose', detail: 'CP choice: Node A refuses the write/read (or the whole minority partition goes read-only) until the partition heals, preserving consistency at the cost of availability. AP choice: Node A accepts the write anyway, remaining available but now inconsistent with the other partition.' },
      { title: '5. Partition heals', detail: 'The two sides reconnect. A CP system had no divergence to fix. An AP system now needs conflict resolution — last-write-wins, vector clocks, or application-level merge logic.' },
    ],
    sections: [
      {
        heading: 'PACELC — the more useful extension',
        body: 'CAP only describes behavior during a partition. The PACELC theorem extends it: "if Partitioned, choose Availability or Consistency; Else (normal operation), choose Latency or Consistency." This is why systems like DynamoDB are tunable — even without a partition, you can trade a bit of consistency for lower latency by relaxing quorum requirements.',
      },
      {
        heading: 'Consistency models, from strongest to weakest',
        bullets: [
          'Strict/linearizable consistency — every operation appears to happen instantaneously at some point between its start and end; the strongest and most expensive guarantee',
          'Sequential consistency — all nodes see operations in the same order, though not necessarily in real-time order',
          'Causal consistency — operations that are causally related are seen in order by everyone; unrelated operations can be seen in different orders on different nodes',
          'Eventual consistency — given no new writes, all replicas will eventually converge to the same value; strongest guarantee that AP systems typically offer',
        ],
        body: '',
      },
      {
        heading: 'Quorum reads/writes: tuning the trade in practice',
        body: 'Many distributed stores (Cassandra, DynamoDB) let you tune consistency per-operation using quorum: with N replicas, a write succeeds after W acknowledge it and a read queries R replicas and returns the most recent value. If W + R > N, reads are guaranteed to overlap with the latest write (strong consistency); if W + R ≤ N, you get lower latency and higher availability at the cost of possibly reading stale data.',
      },
    ],
    pitfalls: [
      'Saying "CAP means you pick 2 of 3" without acknowledging that P is not optional in a real distributed system',
      'Treating "eventually consistent" as "consistency does not matter" instead of understanding the bounded staleness window it implies',
      'Picking a CP or AP database by reputation rather than by what the specific feature actually needs (e.g. a bank ledger needs strong consistency; a "like" counter usually does not)',
    ],
    interviewTips: [
      'Ground the discussion in a concrete feature: "for the messages themselves we want strong consistency, but for the typing indicator, eventual consistency is fine and much cheaper"',
      'Mentioning PACELC or quorum tuning (W+R>N) signals depth beyond the textbook CAP statement',
    ],
    relatedSlugs: ['database-replication-sharding', 'key-value-store'],
    tags: ['CAP theorem', 'consistency', 'availability', 'distributed systems', 'quorum'],
  },
  {
    id: 'sd-rate-limiting',
    slug: 'rate-limiting-algorithms',
    title: 'Rate Limiting Algorithms',
    type: 'fundamental',
    category: 'Reliability',
    summary: 'Token bucket, leaky bucket, and sliding window — how to protect a service from too much traffic.',
    description:
      'A rate limiter caps the number of requests a client can make in a given time window, protecting backend services from being overwhelmed (by traffic spikes, buggy clients, or abuse) and enforcing usage tiers. The algorithm chosen determines the trade-off between memory usage, burst tolerance, and precision.',
    keyPoints: [
      'Rate limiters are typically placed at the API gateway / edge, before requests reach application servers',
      'Token bucket allows bursts up to the bucket size while enforcing a long-term average rate — the most commonly used algorithm in practice (used by AWS, Stripe)',
      'Fixed window counters are simple but allow up to 2x the limit right at window boundaries',
      'Sliding window log is precise but memory-heavy (stores a timestamp per request); sliding window counter approximates it cheaply',
      'In a distributed deployment, counters must live in a shared, fast store (Redis) so all gateway nodes enforce the same limit',
    ],
    architecture: [
      { title: '1. Request arrives at the gateway', detail: 'Identify the client (API key, user ID, or IP) that the limit should be tracked per.' },
      { title: '2. Look up current usage', detail: 'Fetch the client\'s current counter/bucket state from a fast shared store (typically Redis, using INCR or a Lua script for atomicity).' },
      { title: '3. Apply the algorithm', detail: 'Token bucket: check if a token is available, consume it if so. Sliding window: check if the request count in the trailing window is under the limit.' },
      { title: '4a. Under the limit', detail: 'Allow the request through and update the counter/bucket state.' },
      { title: '4b. Over the limit', detail: 'Reject with HTTP 429 Too Many Requests, typically including a Retry-After header.' },
      { title: '5. Async refill/cleanup', detail: 'Token buckets refill on a timer; sliding windows expire old entries — usually done lazily on each request rather than a separate background job.' },
    ],
    sections: [
      {
        heading: 'The four main algorithms',
        bullets: [
          'Token bucket — a bucket holds up to N tokens and refills at rate R/sec; each request consumes one token, requests are rejected when the bucket is empty. Allows controlled bursts up to bucket size. Simple, memory-efficient (two numbers per client).',
          'Leaky bucket — requests enter a fixed-size queue and are processed (leaked) at a constant rate; smooths bursts into a steady output rate but can add latency and drops new requests when the queue is full.',
          'Fixed window counter — count requests in discrete windows (e.g. per-minute); simplest to implement, but a burst spanning a window boundary can let through ~2x the intended limit.',
          'Sliding window log — store a timestamp per request and count how many fall within the trailing window; precise, but memory grows with request volume.',
          'Sliding window counter — approximates the sliding log using a weighted average of the current and previous fixed window; good balance of accuracy and memory use, used by Cloudflare and others.',
        ],
        body: '',
      },
      {
        heading: 'Making it work across a distributed fleet',
        body: 'If each gateway node keeps its own in-memory counter, a client can multiply their effective limit by hitting different nodes. The fix is a centralized, low-latency counter store (Redis) shared by all nodes, with atomic increment-and-check implemented as a single Lua script or using Redis\'s built-in commands to avoid race conditions between the read and the write.',
      },
      {
        heading: 'Where to enforce limits',
        body: 'Limits are commonly layered: a coarse IP-based limit at the edge/CDN to blunt abuse and DDoS-style traffic, and a finer per-user or per-API-key limit at the application gateway to enforce product tiers (e.g. free vs. paid quotas).',
      },
    ],
    tradeoffs: {
      pros: [
        'Protects backend capacity from being exhausted by a single misbehaving or malicious client',
        'Enables tiered product plans (free/paid rate limits)',
        'Token bucket in particular tolerates legitimate bursty usage without over-restricting average throughput',
      ],
      cons: [
        'Adds a stateful dependency (shared counter store) to what could otherwise be a stateless request path',
        'Poorly tuned limits create false positives that block legitimate traffic',
        'Precise algorithms (sliding log) cost more memory; cheap algorithms (fixed window) are less accurate',
      ],
    },
    pitfalls: [
      'Implementing counters per-server instead of in a shared store, letting clients bypass the limit by hitting different nodes',
      'Using fixed window counters for a limit where boundary bursts (2x) actually matter',
      'Forgetting to return a Retry-After header, leaving well-behaved clients to guess when to retry',
    ],
    interviewTips: [
      'Lead with token bucket as the default answer, then discuss fixed/sliding window as alternatives with different trade-offs',
      'Mention where in the stack the limiter sits (edge vs. gateway vs. per-service) — placement is a system design decision, not just an algorithm choice',
    ],
    relatedSlugs: ['scaling-fundamentals', 'consistent-hashing'],
    tags: ['rate limiting', 'token bucket', 'leaky bucket', 'API gateway', 'throttling'],
  },
  {
    id: 'sd-queues',
    slug: 'message-queues-async',
    title: 'Message Queues & Async Processing',
    type: 'fundamental',
    category: 'Scalability',
    summary: 'Decoupling producers from consumers to absorb bursts, isolate failures, and process work asynchronously.',
    description:
      'Not every unit of work needs to happen synchronously within a request. Sending an email, transcoding a video, or fanning out a notification to millions of followers can all be deferred to a background worker via a message queue — improving perceived latency and letting each part of the system scale and fail independently.',
    keyPoints: [
      'A queue decouples producers (who create work) from consumers (who process it), so either side can scale, slow down, or fail without directly affecting the other',
      'Point-to-point queues (SQS, RabbitMQ classic queues) deliver each message to exactly one consumer; pub-sub (Kafka topics, SNS) delivers each message to every subscriber',
      'At-least-once delivery is the common default — consumers must be idempotent to handle occasional duplicate delivery safely',
      'A dead-letter queue captures messages that repeatedly fail processing so they do not block the queue or get silently dropped',
      'Kafka partitions a topic across brokers for throughput while preserving order only within a partition, not across the whole topic',
    ],
    architecture: [
      { title: '1. Producer publishes', detail: 'A service writes a message describing work to be done (e.g. "send email to user X") onto a queue/topic instead of doing the work inline.' },
      { title: '2. Broker persists the message', detail: 'The message broker durably stores the message (often replicated) and acknowledges the producer, decoupling the producer from consumer availability.' },
      { title: '3. Consumer(s) pull or receive', detail: 'One or more consumer workers pull messages (or have them pushed) and process them independently of the producer\'s request lifecycle.' },
      { title: '4. Acknowledge on success', detail: 'After successfully processing, the consumer acks the message so the broker can remove or advance past it; an unacked message is redelivered after a timeout.' },
      { title: '5. Retry or dead-letter on failure', detail: 'A message that keeps failing (e.g. malformed data, downstream outage) is retried with backoff a bounded number of times, then routed to a dead-letter queue for manual inspection.' },
      { title: '6. Scale consumers independently', detail: 'Add more consumer instances (or partitions/consumer groups) to increase processing throughput without touching the producer side at all.' },
    ],
    sections: [
      {
        heading: 'Queue vs. pub-sub',
        bullets: [
          'Point-to-point queue: each message is consumed by exactly one worker from a pool — used for distributing a unit of work (e.g. "process this order").',
          'Publish-subscribe: each message is delivered to every subscriber — used for fanning an event out to multiple independent systems (e.g. "user signed up" triggers email, analytics, and CRM sync simultaneously).',
          'Kafka blurs the line: it is a durable, partitioned log; consumer groups let you get point-to-point semantics within a group and pub-sub semantics across groups.',
        ],
        body: '',
      },
      {
        heading: 'Delivery guarantees',
        bullets: [
          'At-most-once — message may be lost, never redelivered; fastest, used when occasional loss is acceptable',
          'At-least-once — message is guaranteed delivered but may be delivered more than once; the common default, requires idempotent consumers',
          'Exactly-once — no loss, no duplicates; the hardest and most expensive to guarantee, usually implemented via idempotency keys plus transactional writes rather than true magic at the broker level',
        ],
        body: '',
      },
      {
        heading: 'Ordering and idempotency',
        body: 'Strict global ordering across a whole topic kills throughput because it forces single-threaded processing. Kafka and similar systems instead guarantee order only within a partition, and producers pick a partition key (e.g. user ID) so that all events for one entity stay in order relative to each other. Because at-least-once delivery means duplicates are possible, consumers should be idempotent — e.g. keyed on a unique message ID so processing the same message twice has no extra effect.',
      },
    ],
    tradeoffs: {
      pros: [
        'Absorbs traffic bursts — the queue buffers work instead of the caller timing out or the backend falling over',
        'Isolates failures — a slow or down consumer does not block the producer from accepting new requests',
        'Enables independent scaling of producers and consumers, and easy fan-out to multiple downstream systems',
      ],
      cons: [
        'Adds latency for the deferred work (no longer synchronous) and a new component that must be operated and monitored',
        'Introduces eventual consistency — the caller often cannot know exactly when async work completes without polling or a callback',
        'Requires careful handling of retries, duplicates, and ordering that a direct synchronous call does not',
      ],
    },
    pitfalls: [
      'Building consumers that are not idempotent, causing double-charges or duplicate notifications under at-least-once delivery',
      'No dead-letter queue — a single poison message can block a queue and silently halt processing',
      'Assuming global ordering across a partitioned topic',
    ],
    interviewTips: [
      'Identify concretely which part of the flow is "can wait" (send a confirmation email) vs. "must happen inline" (charge the card) — that split is the queue boundary',
      'Bring up idempotency proactively whenever you propose at-least-once delivery; interviewers often probe exactly this gap',
    ],
    relatedSlugs: ['scaling-fundamentals', 'notification-system', 'news-feed-system'],
    tags: ['message queue', 'kafka', 'pub-sub', 'async', 'idempotency'],
  },
  {
    id: 'sd-unique-id',
    slug: 'unique-id-generation',
    title: 'Unique ID Generation at Scale',
    type: 'fundamental',
    category: 'Data & Storage',
    summary: 'Generating globally unique, roughly sortable IDs without a single point of contention.',
    description:
      'Auto-increment primary keys work great on one database, but the moment data is sharded across many nodes, no single counter can hand out sequential IDs without becoming a bottleneck and single point of failure. Distributed ID generation solves this while trying to preserve properties like sortability that auto-increment gave you for free.',
    keyPoints: [
      'UUIDs are simple and fully decentralized but are 128 bits, not sortable by time, and hurt index locality (B-tree page splits) if used as a DB primary key',
      'Twitter Snowflake packs a timestamp, a machine/worker ID, and a per-ms sequence number into a 64-bit integer — roughly time-sortable and collision-free without coordination',
      'A ticket server (single DB doing auto-increment just for ID issuance) is simple but reintroduces a single point of failure unless made highly available',
      'Range/segment allocation lets each node reserve a block of IDs upfront (e.g. from a coordinator like ZooKeeper) and hand them out locally without a round trip per ID',
      'Choose based on what you actually need: strict ordering, rough time-ordering, or just uniqueness',
    ],
    architecture: [
      { title: '1. Request for a new ID', detail: 'A service node needs to generate a unique ID for a new record (e.g. a tweet, an order).' },
      { title: '2. Snowflake-style composition', detail: 'The node composes a 64-bit ID: 1 unused sign bit + 41 bits current timestamp (ms since a custom epoch) + 10 bits machine/worker ID + 12 bits per-millisecond sequence number.' },
      { title: '3. No coordination needed', detail: 'Because each worker has a unique pre-assigned machine ID (from config or a coordination service at startup) and generates its own timestamp + sequence, two workers can never collide — no network call is needed per ID.' },
      { title: '4. Clock handling', detail: 'If the local clock moves backward (NTP adjustment), the generator must detect it and either wait or reject requests briefly to avoid reissuing a past ID.' },
      { title: '5. IDs are roughly sortable', detail: 'Because the timestamp is the highest-order bits, IDs generated later are numerically larger — good enough for chronological sorting without a full sequential guarantee.' },
    ],
    sections: [
      {
        heading: 'Comparing approaches',
        bullets: [
          'UUID (v4): 128-bit random value, effectively zero collision probability, fully decentralized (no coordination or shared state at all). Downside: not sortable, and large/random values fragment database indexes.',
          'Database auto-increment / ticket server: a dedicated DB (or table) whose only job is handing out the next integer. Simple and strictly ordered, but a single point of failure and contention unless you run multiple ticket servers with non-overlapping ranges (e.g. odd/even, or offset+step).',
          'Snowflake (timestamp + worker ID + sequence): no coordination needed per ID, roughly time-sortable, compact (64-bit fits in a normal integer column). Downside: requires assigning unique worker IDs and handling clock skew.',
          'Range/segment allocation: a coordinator hands each node a block of IDs (e.g. 1,000 at a time) to consume locally. Very low latency per ID and few coordinator round-trips, but IDs are not globally time-ordered across nodes.',
        ],
        body: '',
      },
      {
        heading: 'Why sortability matters',
        body: 'Many systems want IDs that are roughly chronologically ordered — it makes "get the latest N items" a cheap indexed range scan instead of requiring a separate timestamp column and secondary index, and it keeps B-tree inserts append-mostly (good for write performance) rather than scattered across random pages like a UUID would cause.',
      },
    ],
    tradeoffs: {
      pros: [
        'Removes the single-database-counter bottleneck, letting ID generation scale with the number of shards/workers',
        'Snowflake-style IDs give rough time-ordering "for free" without any coordination overhead per request',
        'Fully decentralized approaches (UUID) need zero infrastructure and never fail due to a dependency',
      ],
      cons: [
        'Snowflake requires reliable machine/worker ID assignment and clock synchronization discipline',
        'UUIDs bloat storage (128 bits) and hurt index locality if used as a clustered primary key',
        'Range allocation loses cross-node chronological ordering',
      ],
    },
    pitfalls: [
      'Using a single auto-increment column as the primary key after the table has been sharded — it silently stops being unique across shards',
      'Not planning for clock skew/NTP adjustments in a Snowflake-style generator, which can cause duplicate or out-of-order IDs',
      'Choosing UUIDs as a clustered index key on a high-write table and then being surprised by index fragmentation and page-split overhead',
    ],
    interviewTips: [
      'State the actual requirement first — "do we need strict global ordering, or is rough time-ordering enough?" — before picking an approach',
      'Snowflake is usually the strongest default answer for interviews because it needs no coordination per request while staying roughly sortable',
    ],
    relatedSlugs: ['database-replication-sharding', 'url-shortener'],
    tags: ['unique id', 'snowflake', 'UUID', 'distributed systems', 'sharding'],
  },

  // ============================================================
  // CASE STUDIES
  // ============================================================
  {
    id: 'cs-url-shortener',
    slug: 'url-shortener',
    title: 'URL Shortener',
    type: 'case-study',
    category: 'Case Study',
    difficulty: 'Easy',
    summary: 'A classic warm-up problem: encode a long URL into a short, unique alias and redirect on lookup.',
    description:
      'Design a service like bit.ly or TinyURL: given a long URL, generate a short alias that redirects to it. It is often the first system design question asked because the core problem is small, but it exercises encoding schemes, database schema design, caching, and capacity estimation cleanly.',
    keyPoints: [
      'Read-heavy workload — redirects vastly outnumber URL creations (often 100:1 or more), which should drive the caching strategy',
      'Base62 encoding of an auto-incrementing/distributed counter is simpler and more predictable than hashing + collision handling',
      'A 7-character Base62 code gives 62^7 ≈ 3.5 trillion possible short URLs — more than enough headroom',
      'Use HTTP 301 (permanent) redirect only if you never need click analytics; use 302 (temporary) if you want every redirect to hit your server for tracking',
      'The redirect path is the hot path — it should be servable almost entirely from cache',
    ],
    architecture: [
      { title: '1. Client submits a long URL', detail: 'POST /api/shorten with the original URL hits an API server behind a load balancer.' },
      { title: '2. Generate a unique key', detail: 'The service obtains a unique ID (e.g. from a Snowflake-style generator or a pre-allocated range) and encodes it to Base62 to produce a short code like "aZ3kP9q".' },
      { title: '3. Persist the mapping', detail: 'Store {short_code, long_url, created_at, expiry} in a database, keyed by short_code for O(1) lookup.' },
      { title: '4. Return the short URL', detail: 'Respond with https://short.ly/{short_code} to the client.' },
      { title: '5. Client visits the short URL', detail: 'GET /{short_code} hits the redirect service.' },
      { title: '6. Cache lookup first', detail: 'Check a cache (Redis) for short_code → long_url. On a hit, respond immediately with a 301/302 redirect — this serves the overwhelming majority of traffic.' },
      { title: '7. Cache miss → DB lookup', detail: 'On a miss, query the database, populate the cache, and then redirect.' },
    ],
    sections: [
      {
        heading: 'Encoding: counter + Base62 vs. hashing',
        body: 'Two common approaches. (1) Take a globally unique, ideally monotonically increasing integer ID (from a distributed ID generator) and encode it in Base62 (a-z, A-Z, 0-9) — guaranteed unique with zero collision-handling logic. (2) Hash the long URL (e.g. MD5) and take the first 7 characters — simple, but different URLs can collide on the truncated hash, requiring a retry-with-salt loop. The counter approach is generally preferred in interviews because it sidesteps collision handling entirely.',
      },
      {
        heading: 'Schema',
        body: 'A minimal table: short_code (indexed, primary key), long_url, user_id (optional, for "my links" features), created_at, expires_at. At the estimated scale (low terabytes over years, per the estimation topic), this fits comfortably in a sharded relational database, sharded by short_code using consistent hashing if a single node is insufficient.',
      },
      {
        heading: 'Custom aliases and expiration',
        body: 'Supporting user-chosen aliases just means checking short_code uniqueness before insert instead of generating one. Expiration is enforced either lazily (check expires_at on lookup, treat as a miss if expired) or via a background job that purges expired rows and evicts them from cache.',
      },
    ],
    tradeoffs: {
      pros: [
        'Simple read path that caches extremely well due to the skewed, read-heavy access pattern',
        'Counter + Base62 avoids collision handling entirely, keeping the write path simple',
        'Naturally shardable by short_code once a single database is insufficient',
      ],
      cons: [
        'A centralized ID generator (or range allocator) is a dependency every write path relies on',
        '301 redirects get cached by browsers, making later analytics or link updates impossible — forces a 302 if analytics matter',
        'Custom aliases add a uniqueness-check-before-insert step that a pure counter scheme does not need',
      ],
    },
    pitfalls: [
      'Choosing hash-based short codes and forgetting to handle the (rare but real) collision case',
      'Using 301 redirects while also wanting click-through analytics — the browser will bypass your server on repeat visits',
      'Not putting a cache in front of the redirect path despite the read:write ratio screaming for one',
    ],
    interviewTips: [
      'Run the estimation early — it justifies both the Base62 code length and the caching decision',
      'Be ready to discuss the counter-generation approach (Snowflake vs. a ticket-server range allocator) — it is a natural deep-dive target',
    ],
    relatedSlugs: ['unique-id-generation', 'caching-strategies', 'back-of-envelope-estimation'],
    tags: ['url shortener', 'base62', 'caching', 'redirect', 'easy'],
  },
  {
    id: 'cs-web-crawler',
    slug: 'web-crawler',
    title: 'Web Crawler',
    type: 'case-study',
    category: 'Case Study',
    difficulty: 'Medium',
    summary: 'A distributed system that discovers, fetches, and stores billions of web pages without hammering any one site.',
    description:
      'Design a scalable web crawler that starts from a set of seed URLs, discovers new links, and fetches page content — the kind of system behind search engines and archival services. The core tension is between crawling as fast as possible and being a polite, well-behaved citizen of the web.',
    keyPoints: [
      'The system is I/O bound (waiting on network responses), so it needs high concurrency, not raw CPU',
      'Politeness requires per-host rate limiting and honoring robots.txt — crawling too fast from one host looks like a DoS attack',
      'A URL frontier (priority queue) decides crawl order, balancing freshness, page importance, and politeness',
      'Deduplication (of both URLs and page content) at billions-of-pages scale needs a space-efficient structure like a Bloom filter, not an exact hash set',
      'DNS resolution is a common hidden bottleneck at scale and benefits from a local caching resolver',
    ],
    architecture: [
      { title: '1. Seed URLs', detail: 'The frontier is initialized with a set of seed URLs to start crawling from.' },
      { title: '2. URL frontier', detail: 'A prioritized, politeness-aware queue hands out URLs to fetch — typically partitioned per host with per-host rate limits so no single site is overwhelmed.' },
      { title: '3. Fetcher workers', detail: 'A large pool of worker threads/processes pull URLs from the frontier, resolve DNS (via a caching resolver), and download page content over HTTP.' },
      { title: '4. robots.txt & politeness check', detail: 'Before fetching, check a cached copy of the host\'s robots.txt to confirm the URL is allowed and to respect the crawl-delay directive.' },
      { title: '5. Content dedup', detail: 'Hash the fetched content and check it against a seen-content index (Bloom filter) to skip storing/parsing duplicate or mirrored pages.' },
      { title: '6. Parse & extract links', detail: 'Extract new links from the page HTML, normalize them (resolve relative URLs, strip fragments/tracking params), and check each against a seen-URL filter.' },
      { title: '7. Enqueue new URLs', detail: 'Unseen URLs are pushed back into the URL frontier, and the fetched content is stored/indexed downstream (e.g. for a search index).' },
    ],
    sections: [
      {
        heading: 'The URL frontier: politeness + priority',
        body: 'A naive FIFO queue would let one large domain (say, wikipedia.org with millions of pages) monopolize crawler capacity and get hammered simultaneously by every worker. The frontier is instead split into a front queue (prioritizes URLs by importance/freshness, e.g. PageRank-like score or update frequency) feeding a back queue that is partitioned one-queue-per-host, with a mapping table ensuring only one worker pulls from a given host\'s queue at a time and enforces a minimum delay between requests to that host.',
      },
      {
        heading: 'Deduplication at scale',
        bullets: [
          'URL-seen check: billions of URLs make an exact in-memory hash set infeasible; a Bloom filter gives fast, memory-efficient approximate membership testing (false positives — occasionally skipping a genuinely new URL — are an acceptable trade for the memory savings).',
          'Content-seen check: many URLs point to identical or near-identical content (mirrors, tracking-parameter variants); hashing normalized content and checking that hash catches these even when the URLs differ.',
        ],
        body: '',
      },
      {
        heading: 'Robustness concerns',
        bullets: [
          'Crawler traps: infinitely generated URLs (e.g. calendar pages that link to "next month" forever) — bound crawl depth and detect suspiciously repetitive URL patterns.',
          'Malicious/malformed content: fetchers must sandbox parsing and set strict timeouts so one broken server cannot stall a worker indefinitely.',
          'Freshness vs. coverage: re-crawling pages that change often (news) versus discovering brand-new pages both compete for the same worker capacity, and priority scoring has to balance them.',
        ],
        body: '',
      },
    ],
    tradeoffs: {
      pros: [
        'Highly parallelizable — throughput scales close to linearly by adding fetcher workers',
        'Per-host politeness queues prevent the crawler from being a de facto denial-of-service tool',
        'Bloom filters keep dedup memory bounded even at web scale',
      ],
      cons: [
        'Bloom filters introduce false positives, meaning some genuinely new pages get silently skipped',
        'Politeness constraints intentionally cap how fast any single large domain can be crawled',
        'Extremely large operational surface: DNS caching, robots.txt caching, storage, and link-graph processing all need to scale together',
      ],
    },
    pitfalls: [
      'Designing a single global queue instead of per-host partitioning, leading to accidental DoS of popular domains',
      'Using an exact hash set for URL-seen tracking without discussing the memory cost at billions of URLs',
      'Forgetting robots.txt entirely, or not caching it (refetching it before every single page request)',
    ],
    interviewTips: [
      'Lead with the politeness constraint — it is the detail that most distinguishes a real crawler design from "just fetch pages in parallel"',
      'Bloom filters are a strong, specific deep-dive: be ready to explain the false-positive/memory trade-off and rough sizing',
    ],
    relatedSlugs: ['message-queues-async', 'consistent-hashing', 'scaling-fundamentals'],
    tags: ['web crawler', 'bloom filter', 'politeness', 'distributed systems', 'medium'],
  },
  {
    id: 'cs-notification-system',
    slug: 'notification-system',
    title: 'Notification System',
    type: 'case-study',
    category: 'Case Study',
    difficulty: 'Medium',
    summary: 'A fan-out service that reliably delivers push, SMS, and email notifications through third-party providers.',
    description:
      'Design a system that lets any internal service trigger a notification to a user across push, SMS, and email — the kind of infrastructure behind "your order shipped" or "someone liked your post" alerts. The core challenges are reliability (do not lose notifications), avoiding user spam, and gracefully handling flaky third-party providers.',
    keyPoints: [
      'The system sits behind a message queue so that a burst of notification requests (e.g. a viral post) never directly overloads third-party provider APIs',
      'Each channel (push/SMS/email) has its own queue and worker pool, since providers have different rate limits, latencies, and failure modes',
      'Idempotency keys prevent duplicate sends when a message is retried after an ambiguous failure (request succeeded at the provider but the ack was lost)',
      'A user preference/settings check must happen before send, not just at request time, to respect opt-outs and quiet hours',
      'Third-party providers (APNs, FCM, Twilio, SendGrid) are the actual bottleneck and failure point — the system\'s job is largely to queue, retry, and fail over between them gracefully',
    ],
    architecture: [
      { title: '1. Internal service triggers a notification', detail: 'e.g. the order service calls the notification service\'s API with a template ID, user ID, and payload data after an order ships.' },
      { title: '2. Validate & enrich', detail: 'The notification API looks up the user\'s contact info and channel preferences (push token, phone, email; opted-in channels; quiet hours) from a user-profile store.' },
      { title: '3. Enqueue per channel', detail: 'A message is placed on the appropriate channel-specific queue (push queue, SMS queue, email queue) — decoupling the request from the actual third-party delivery call.' },
      { title: '4. Channel workers consume', detail: 'A dedicated worker pool per channel pulls from its queue and calls the relevant third-party provider (FCM/APNs for push, Twilio for SMS, SendGrid for email), respecting that provider\'s rate limits.' },
      { title: '5. Handle provider response', detail: 'On success, mark the notification as sent. On a retryable failure (timeout, 5xx), requeue with exponential backoff up to a max retry count.' },
      { title: '6. Dead-letter on repeated failure', detail: 'Notifications that exhaust retries go to a dead-letter queue for monitoring/alerting instead of being silently dropped.' },
      { title: '7. Track delivery status', detail: 'Provider webhooks (delivery/open/bounce events) update a notification log, which powers analytics and lets the system detect and pause sends to permanently invalid addresses/tokens.' },
    ],
    sections: [
      {
        heading: 'Why per-channel queues',
        body: 'Push, SMS, and email have wildly different throughput characteristics: SMS providers often cap throughput far below push notification services, and a slow email provider outage should never back up push delivery. Separate queues (and separate worker pools sized to each provider\'s actual limits) contain the blast radius of a slow or failing channel to that channel alone.',
      },
      {
        heading: 'Idempotency and exactly-once-feeling delivery',
        body: 'Network calls to third-party providers can fail ambiguously — the SMS may have actually sent even though the HTTP response timed out. Attaching a client-generated idempotency key to each send request (which well-behaved providers deduplicate on their side) prevents a retry from double-sending the same notification to a user.',
      },
      {
        heading: 'Respecting user preferences and avoiding spam',
        body: 'Preference checks (opted-out channels, do-not-disturb hours, notification-type mute settings) should be enforced at send time, not just at the original trigger, since preferences can change between when an event happens and when a queued notification is finally processed. A per-user, per-notification-type rate limit (reusing the rate-limiting algorithms above) also prevents a bug in an upstream service from spamming a user with duplicate alerts.',
      },
    ],
    tradeoffs: {
      pros: [
        'Queue-based decoupling means an upstream traffic spike or a slow provider never cascades into failing the triggering service\'s request',
        'Per-channel isolation contains provider-specific outages',
        'Centralizing notification logic gives one place to enforce preferences, quiet hours, and rate limits consistently',
      ],
      cons: [
        'End-to-end delivery is now asynchronous and best-effort — the triggering service cannot know synchronously whether a notification was actually delivered',
        'More moving parts (multiple queues, worker pools, provider integrations, a preference store) than a direct "just call the API" approach',
        'Exactly-once delivery is not truly achievable — the system can only get close via idempotency keys and provider-side dedup',
      ],
    },
    pitfalls: [
      'Sending directly to the provider API from the request path instead of through a queue, so a viral spike in triggers directly DoSes (or gets rate-limited by) the provider',
      'Not deduplicating retries, causing users to receive the same push notification multiple times',
      'Checking user opt-out status only when the notification is first triggered, not again right before send',
    ],
    interviewTips: [
      'Emphasize the queue-per-channel design early — it is the single decision that most determines the system\'s resilience',
      'Bring up idempotency keys proactively; it is one of the most commonly probed gaps in this problem',
    ],
    relatedSlugs: ['message-queues-async', 'rate-limiting-algorithms'],
    tags: ['notification system', 'fan-out', 'idempotency', 'message queue', 'medium'],
  },
  {
    id: 'cs-news-feed',
    slug: 'news-feed-system',
    title: 'News Feed System',
    type: 'case-study',
    category: 'Case Study',
    difficulty: 'Medium',
    summary: 'Aggregating posts from everyone you follow into one personalized, fast-loading feed — the fan-out problem.',
    description:
      'Design a news feed like Facebook\'s or Twitter\'s timeline: when a user opens the app, show a reverse-chronological (or ranked) feed of posts from people they follow. The central architectural decision is when to compute each user\'s feed: at post time (fan-out on write) or at read time (fan-out on read) — and most real systems use a hybrid of both.',
    keyPoints: [
      'Feed publishing (what happens when a user posts) and feed generation (what happens when a user opens their feed) are two largely independent pipelines with different scaling concerns',
      'Fan-out on write pre-computes each follower\'s feed at post time and stores it (e.g. in Redis lists) — reads are then a single fast lookup, but a celebrity with 100M followers makes a single post extremely expensive to fan out',
      'Fan-out on read composes the feed at request time by merging recent posts from everyone the user follows — cheap for the poster, expensive for readers with many follows',
      'The standard solution is hybrid: fan-out on write for typical users, fan-out on read (merged in at request time) for celebrity/high-follower accounts',
      'Feed content itself is usually cached as a list of post IDs, not full post bodies — post content is fetched from a separate, independently cacheable content store by ID',
    ],
    architecture: [
      { title: '1. User publishes a post', detail: 'The post is written to a durable post store and assigned an ID; the publish request returns quickly rather than waiting for fan-out.' },
      { title: '2. Async fan-out job enqueued', detail: 'A message queue picks up the "new post" event and hands it to fan-out workers, decoupling publishing latency from delivery to followers.' },
      { title: '3. Fan-out on write (regular users)', detail: 'Workers look up the poster\'s follower list and push the new post ID onto each follower\'s precomputed feed cache (a capped-size list in Redis, keyed by user ID).' },
      { title: '4. Skip fan-out for celebrities', detail: 'If the poster has followers above a threshold, skip the expensive per-follower push entirely — their posts are merged in at read time instead.' },
      { title: '5. User opens their feed', detail: 'The feed service reads the user\'s precomputed feed list from cache (fast path) and separately fetches any recent posts from celebrities they follow.' },
      { title: '6. Merge & rank', detail: 'The two sources (precomputed feed + celebrity posts) are merged, ranked (chronological or by a relevance score), and paginated.' },
      { title: '7. Hydrate post content', detail: 'The merged list of post IDs is used to batch-fetch full post content (text, media URLs, like counts) from a separately cached content store.' },
    ],
    sections: [
      {
        heading: 'Fan-out on write vs. fan-out on read',
        bullets: [
          'Fan-out on write (push): feed reads are O(1) — just read a precomputed list. But posting becomes O(followers): a user with 50M followers triggers 50M cache writes for a single post, which is both slow and wasteful if many of those followers rarely check their feed.',
          'Fan-out on read (pull): posting is O(1) — just write the post once. But reading becomes expensive: merging recent posts from everyone a user follows (which can be thousands of accounts) at request time.',
          'Hybrid: fan-out on write for the vast majority of accounts (bounded follower counts), fan-out on read only for celebrity accounts above a threshold, merged into the feed at request time. This captures the read-speed benefit for almost all posts while avoiding the celebrity-post fan-out explosion.',
        ],
        body: '',
      },
      {
        heading: 'Why store IDs, not content, in the feed cache',
        body: 'A precomputed feed stores an ordered list of post IDs per user rather than full post bodies. This keeps the feed cache small and cheap to maintain, and — critically — means a single edit to a post (or an updated like count) does not require rewriting that post everywhere it appears across millions of followers\' feed caches. Post content is fetched separately, in bulk, by ID from its own cache/store at read time.',
      },
      {
        heading: 'Ranking beyond chronological order',
        body: 'A pure reverse-chronological feed is simplest, but most production feeds rank by a relevance score (recency, affinity with the poster, predicted engagement) computed by a separate ranking service, which the feed generation step calls after assembling the candidate post list and before final pagination. This is a natural deep-dive extension once the base fan-out design is established.',
      },
    ],
    tradeoffs: {
      pros: [
        'Hybrid fan-out gives the vast majority of reads O(1) latency without the celebrity-post fan-out blowing up write costs',
        'Decoupling post publishing from fan-out (via a queue) keeps the post action itself fast and available',
        'Storing IDs instead of content in the feed cache keeps edits and like-count updates cheap',
      ],
      cons: [
        'Feed cache is inherently eventually consistent — a follower may not see a new post for a few seconds until fan-out completes',
        'Hybrid design adds real complexity: two different code paths (precomputed + on-the-fly merge) that both have to be correct and tested',
        'Precomputed feed caches consume significant memory across hundreds of millions of users, each holding a capped list of recent post IDs',
      ],
    },
    pitfalls: [
      'Applying pure fan-out-on-write with no celebrity exception, causing a single post from a huge account to generate an enormous, slow write storm',
      'Storing full post content inside every follower\'s feed cache, making a post edit or like-count update require touching millions of cache entries',
      'Treating publish and fan-out as synchronous, making the post action itself as slow as the slowest fan-out',
    ],
    interviewTips: [
      'Introduce fan-out on write first (it is intuitive), then let the celebrity-account discussion motivate the hybrid design yourself — this shows the reasoning rather than reciting a known answer',
      'Explicitly separate "feed publishing" and "feed generation" as two pipelines early — it organizes the rest of the discussion cleanly',
    ],
    relatedSlugs: ['message-queues-async', 'caching-strategies', 'chat-system'],
    tags: ['news feed', 'fan-out', 'timeline', 'social network', 'medium'],
  },
  {
    id: 'cs-chat-system',
    slug: 'chat-system',
    title: 'Chat System (WhatsApp / Messenger)',
    type: 'case-study',
    category: 'Case Study',
    difficulty: 'Medium',
    summary: 'Real-time 1:1 and group messaging with delivery guarantees, presence, and multi-device sync.',
    description:
      'Design a real-time chat system like WhatsApp or Messenger: users send messages that are delivered instantly if the recipient is online, and reliably queued for delivery when they are not. The core challenge is maintaining a persistent connection to millions of concurrent users efficiently and handling delivery guarantees, ordering, and presence on top of it.',
    keyPoints: [
      'WebSockets (a persistent, full-duplex TCP connection) are the standard choice for real-time delivery, replacing older polling/long-polling approaches that either waste requests or tie up server threads',
      'Each user maintains a persistent connection to one specific chat server; a separate service tracks which server holds which user\'s connection so messages can be routed correctly across a fleet',
      'Messages are always persisted to durable storage before being considered "sent" — the real-time push is a delivery optimization, not the source of truth',
      'Group chat fan-out (delivering one message to N members) is architecturally the same small-scale problem the news feed system solves at huge scale',
      'Presence (online/offline/last-seen) is typically implemented with a heartbeat mechanism plus a short TTL, not push notifications for every state change',
    ],
    architecture: [
      { title: '1. Client connects', detail: 'On app open, the client establishes a persistent WebSocket connection to a chat server, authenticated via a token; a connection-mapping service records {user_id → chat_server_id}.' },
      { title: '2. Sender sends a message', detail: 'The client sends the message over its WebSocket to its connected chat server, tagged with a client-generated message ID (for dedup) and a local sequence number (for ordering).' },
      { title: '3. Persist first', detail: 'The chat server writes the message durably (e.g. to a per-conversation table/log) and acks the sender — this durability step happens before any delivery attempt, so the message is never lost even if delivery fails.' },
      { title: '4. Look up the recipient\'s connection', detail: 'The server queries the connection-mapping service to find which chat server (if any) currently holds the recipient\'s WebSocket connection.' },
      { title: '5a. Recipient online', detail: 'The message is routed (directly or via a lightweight internal pub-sub between chat servers) to the recipient\'s connected server and pushed down their WebSocket in real time.' },
      { title: '5b. Recipient offline', detail: 'The message stays in durable storage as undelivered; a push notification is sent via the notification system, and the message is delivered on next connect via a sync/catch-up read.' },
      { title: '6. Delivery/read receipts', detail: 'The recipient\'s client acks receipt (and later, read status) back over its WebSocket, which the server relays to the sender to update message status (sent → delivered → read).' },
    ],
    sections: [
      {
        heading: 'Why WebSockets over polling',
        bullets: [
          'Polling: client repeatedly asks "any new messages?" — simple, but wastes requests and adds up to polling-interval latency.',
          'Long polling: client asks and the server holds the request open until there is something to return (or a timeout) — better latency, but still ties up a connection per pending request and needs quick reconnect.',
          'WebSocket: one persistent, bidirectional connection — the server can push the instant a message arrives, and the client can send without a new handshake each time. The standard choice once true real-time delivery matters.',
        ],
        body: '',
      },
      {
        heading: 'The connection-mapping problem',
        body: 'With millions of users spread across a fleet of chat servers, no single server holds every connection, so routing a message to "whichever server user B is connected to" needs a fast lookup layer (commonly Redis, mapping user_id → server_id, updated on connect/disconnect) plus a way for chat servers to forward a message to each other (often a lightweight internal pub-sub or direct RPC) once they know the target server.',
      },
      {
        heading: 'Group chat as small-scale fan-out',
        body: 'Sending a message to a group of N members means writing it once to durable storage and then delivering it to up to N connected recipients — the same fan-out shape as the news feed problem, just at a scale (tens to low thousands of members, not millions of followers) where a straightforward per-recipient push at send time is entirely sufficient without needing a hybrid celebrity-style optimization.',
      },
      {
        heading: 'Ordering, dedup, and multi-device sync',
        body: 'Message ordering within a single conversation is typically preserved with a per-conversation monotonic sequence number assigned at persistence time (not client-side clocks, which can skew). Client-generated message IDs let the server (and receiving clients) deduplicate a message that gets resent after an ambiguous network failure. Supporting a user on multiple devices means the connection-mapping layer tracks a set of connections per user, not just one, and fans a new message out to all of that user\'s active devices.',
      },
    ],
    tradeoffs: {
      pros: [
        'WebSockets give true low-latency, bidirectional real-time delivery with far less overhead than repeated polling',
        'Persist-before-deliver ensures no message is lost even if a chat server crashes mid-delivery',
        'Connection-mapping via a fast shared store lets the chat server fleet scale horizontally while still routing correctly',
      ],
      cons: [
        'Maintaining millions of long-lived stateful connections is operationally heavier than stateless HTTP — connections must be rebalanced on deploys and server failures',
        'Multi-device support multiplies the fan-out and read-receipt bookkeeping per message',
        'The connection-mapping service becomes critical-path infrastructure that must itself be highly available',
      ],
    },
    pitfalls: [
      'Treating the WebSocket push as the source of truth instead of persisting the message durably first',
      'Using client-side timestamps for message ordering, which breaks under clock skew between devices',
      'Not planning for reconnect/catch-up — a client that reconnects after being offline needs a way to fetch everything it missed, not just future pushes',
    ],
    interviewTips: [
      'Draw the connection-mapping layer explicitly — "how does server A know user B is connected to server C" is usually the crux deep-dive question',
      'State persist-then-deliver as a design principle early; it preempts a common follow-up about message loss',
    ],
    relatedSlugs: ['message-queues-async', 'news-feed-system', 'notification-system'],
    tags: ['chat system', 'websocket', 'real-time', 'presence', 'medium'],
  },
  {
    id: 'cs-key-value-store',
    slug: 'key-value-store',
    title: 'Distributed Key-Value Store',
    type: 'case-study',
    category: 'Case Study',
    difficulty: 'Hard',
    summary: 'A Dynamo-style store that ties together consistent hashing, replication, and tunable consistency into one system.',
    description:
      'Design a distributed key-value store like Amazon DynamoDB or Riak: a simple get(key)/put(key, value) interface backed by a cluster that must stay available and fast even as nodes fail or the network partitions. This is less about any single new idea and more about correctly combining several fundamentals — consistent hashing, replication, quorum, and conflict resolution — into one coherent system, which is exactly why it is a strong deep-dive interview question.',
    keyPoints: [
      'Data is partitioned across nodes using consistent hashing so the cluster can grow or shrink with minimal data movement',
      'Each key is replicated to N nodes (the next N-1 successors on the hash ring) for fault tolerance',
      'Quorum reads/writes (W + R > N) tune the consistency/availability/latency trade-off per operation rather than fixing it system-wide',
      'Vector clocks (or simpler last-write-wins timestamps) resolve conflicting versions of a key that arise when the system stays available during a partition',
      'This system is unapologetically AP-leaning (per CAP theorem) — it favors availability and prioritizes never rejecting a write over strict consistency',
    ],
    architecture: [
      { title: '1. Client sends a request', detail: 'A put(key, value) or get(key) call arrives, typically routed through any node in the cluster (a "coordinator" for that request).' },
      { title: '2. Locate the key on the ring', detail: 'The coordinator hashes the key to find its position on the consistent-hashing ring and identifies the N nodes responsible for it (the key\'s position plus its N-1 clockwise successors).' },
      { title: '3a. Write path', detail: 'The coordinator sends the write to all N replica nodes and waits for at least W acknowledgments before returning success to the client (W tunable per request/table).' },
      { title: '3b. Read path', detail: 'The coordinator queries R of the N replicas, and if their versions differ, uses vector clocks (or timestamps) to reconcile which value(s) to return — possibly returning multiple conflicting versions for the client/application to resolve.' },
      { title: '4. Handle node failure: hinted handoff', detail: 'If a replica is temporarily unreachable during a write, another node stores the write with a "hint" to forward it to the intended replica once it recovers, preserving availability without losing the write.' },
      { title: '5. Anti-entropy: Merkle trees', detail: 'Nodes periodically compare Merkle tree hashes of their data ranges with their replica peers to detect and repair inconsistencies efficiently, without transferring or diffing entire datasets.' },
      { title: '6. Failure detection: gossip protocol', detail: 'Nodes gossip membership and health information to each other peer-to-peer, so the cluster converges on an up-to-date view of which nodes are alive without a single central coordinator.' },
    ],
    sections: [
      {
        heading: 'Why this problem is "hard": composition, not novelty',
        body: 'Nearly every piece of this design — consistent hashing, replication, quorum consistency, CAP trade-offs — is covered as its own fundamental topic. What makes the key-value store difficult is that these pieces interact: your replication factor affects your quorum math, your quorum choice affects how often you see conflicting versions, and conflicting versions require a resolution strategy that has to be consistent with the availability guarantees you promised. A strong answer explicitly connects these pieces rather than listing them independently.',
      },
      {
        heading: 'Resolving conflicting versions',
        bullets: [
          'Last-write-wins (LWW): attach a timestamp to each write, keep the newest on conflict. Simple, but can silently discard a legitimate concurrent write (clock skew makes "newest" unreliable too).',
          'Vector clocks: each version carries a per-node counter vector; the system can detect when two versions are genuinely concurrent (neither is an ancestor of the other) versus one simply superseding the other, and surface true conflicts to the application to merge (e.g. Dynamo\'s shopping-cart merge) instead of silently picking a winner.',
        ],
        body: '',
      },
      {
        heading: 'Sloppy quorum and hinted handoff',
        body: 'Strict quorum would refuse a write if any of the fixed N replica nodes are down, even briefly. Sloppy quorum instead allows the write to go to the next N healthy nodes on the ring if some of the "true" owners are unreachable, preserving write availability; hinted handoff ensures that write is later delivered to the correct node once it recovers, keeping the system both available now and correct eventually.',
      },
      {
        heading: 'Read/write path performance knobs',
        body: 'Lowering W and R reduces latency (fewer nodes to wait on) and increases availability (tolerates more simultaneous node failures) at the cost of a higher chance of reading stale or conflicting data. This is the PACELC trade-off in concrete, tunable form — many real systems expose W/R (or an equivalent consistency level) as a per-table or even per-request setting.',
      },
    ],
    tradeoffs: {
      pros: [
        'No single point of failure — the ring, replication, and gossip-based membership all avoid a central coordinator',
        'Tunable consistency lets each application decide its own point on the latency/consistency/availability trade-off',
        'Scales horizontally with minimal data movement thanks to consistent hashing',
      ],
      cons: [
        'Conflict resolution (vector clocks) pushes real complexity into the application layer when true concurrent writes occur',
        'Significantly harder to reason about and operate than a single-node database — eventual consistency bugs are subtle and easy to miss in testing',
        'No native support for cross-key transactions or joins — it is deliberately a simple key-value interface',
      ],
    },
    pitfalls: [
      'Proposing consistent hashing and replication but forgetting to specify W/R quorum values and what they imply for consistency',
      'Using last-write-wins without acknowledging it can silently drop a concurrent write — fine for many use cases, but say so explicitly',
      'Not mentioning anti-entropy (Merkle trees) or failure detection (gossip) — without them, replicas silently drift out of sync forever',
    ],
    interviewTips: [
      'Treat this as a synthesis problem: explicitly name which fundamental (consistent hashing, CAP, replication) each piece of your design is applying, and why',
      'A good signal move: state your CAP choice up front ("I am designing this AP-leaning, like Dynamo") and let every subsequent decision consistently follow from it',
    ],
    relatedSlugs: ['consistent-hashing', 'cap-theorem-consistency', 'database-replication-sharding'],
    tags: ['key-value store', 'dynamo', 'consistent hashing', 'quorum', 'vector clocks', 'hard'],
  },
];

export function getSystemDesignTopicBySlug(slug: string): SystemDesignTopic | undefined {
  return systemDesignTopics.find((t) => t.slug === slug);
}

export function getFundamentals(): SystemDesignTopic[] {
  return systemDesignTopics.filter((t) => t.type === 'fundamental');
}

export function getCaseStudies(): SystemDesignTopic[] {
  return systemDesignTopics.filter((t) => t.type === 'case-study');
}

export function getRelatedTopics(topic: SystemDesignTopic): SystemDesignTopic[] {
  return topic.relatedSlugs
    .map((slug) => getSystemDesignTopicBySlug(slug))
    .filter((t): t is SystemDesignTopic => Boolean(t));
}
