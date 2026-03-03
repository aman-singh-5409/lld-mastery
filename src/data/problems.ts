export interface Problem {
  id: string;
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description: string;
  requirements: string[];
  classes: string[];
  patterns: string[];
  languages: string[];
  diagramFile: string;
  tags: string[];
  pythonCode?: string;
}

export const problems: Problem[] = [
  {
    id: 'parking-lot',
    title: 'Parking Lot System',
    slug: 'parking-lot',
    difficulty: 'Medium',
    category: 'System Design',
    description: 'Design a parking lot system that manages multiple levels with different types of parking spots for various vehicle types. The system should handle concurrent access and provide real-time availability tracking.',
    requirements: [
      'Support multiple levels, each with a certain number of parking spots',
      'Support different types of vehicles: cars, motorcycles, and trucks',
      'Each parking spot should accommodate a specific type of vehicle',
      'Assign a parking spot to a vehicle upon entry and release it on exit',
      'Track availability of parking spots with real-time information',
      'Handle multiple entry and exit points with concurrent access',
    ],
    classes: ['ParkingLot (Singleton)', 'ParkingFloor', 'ParkingSpot', 'Vehicle (abstract)', 'Car', 'Motorcycle', 'Truck', 'ParkingTicket', 'VehicleSize (enum)', 'FeeStrategy', 'ParkingStrategy'],
    patterns: ['Singleton', 'Strategy', 'Factory'],
    languages: ['Python', 'Java', 'C++', 'C#', 'Go', 'TypeScript'],
    diagramFile: 'parkinglot-class-diagram.png',
    tags: ['Singleton', 'Concurrency', 'OOP', 'Strategy Pattern'],
    pythonCode: `import threading
from typing import List, Dict, Optional

class ParkingSpot:
    def __init__(self, spot_id: str, spot_type: str):
        self.spot_id = spot_id
        self.spot_type = spot_type
        self.vehicle = None
        self._lock = threading.Lock()

    def is_available(self) -> bool:
        return self.vehicle is None

    def park_vehicle(self, vehicle) -> bool:
        with self._lock:
            if self.is_available() and self.spot_type == vehicle.size:
                self.vehicle = vehicle
                return True
            return False

    def unpark_vehicle(self):
        with self._lock:
            self.vehicle = None

    def get_spot_id(self) -> str:
        return self.spot_id


class Vehicle:
    def __init__(self, license_number: str, size: str):
        self.license_number = license_number
        self.size = size

    def get_license_number(self) -> str:
        return self.license_number


class Car(Vehicle):
    def __init__(self, license_number: str):
        super().__init__(license_number, "COMPACT")


class ParkingFloor:
    def __init__(self, floor_id: int, spots: List[ParkingSpot]):
        self.floor_id = floor_id
        self.spots = spots

    def park_vehicle(self, vehicle: Vehicle) -> Optional[ParkingSpot]:
        for spot in self.spots:
            if spot.is_available() and spot.park_vehicle(vehicle):
                return spot
        return None

    def unpark_vehicle(self, spot_id: str):
        for spot in self.spots:
            if spot.get_spot_id() == spot_id:
                spot.unpark_vehicle()
                return


class ParkingLot:
    _instance = None
    _lock = threading.Lock()

    def __init__(self):
        if ParkingLot._instance is not None:
            raise Exception("This class is a singleton!")
        self.floors: List[ParkingFloor] = []
        self.active_tickets: Dict[str, ParkingSpot] = {}
        self._main_lock = threading.Lock()

    @staticmethod
    def get_instance():
        if ParkingLot._instance is None:
            with ParkingLot._lock:
                if ParkingLot._instance is None:
                    ParkingLot._instance = ParkingLot()
        return ParkingLot._instance

    def add_floor(self, floor: ParkingFloor):
        self.floors.append(floor)

    def park_vehicle(self, vehicle: Vehicle) -> Optional[ParkingSpot]:
        with self._main_lock:
            for floor in self.floors:
                spot = floor.park_vehicle(vehicle)
                if spot is not None:
                    self.active_tickets[vehicle.get_license_number()] = spot
                    print(f"Vehicle {vehicle.get_license_number()} parked at spot {spot.get_spot_id()}")
                    return spot
            print(f"No available spot for vehicle {vehicle.get_license_number()}")
            return None

    def unpark_vehicle(self, license_number: str):
        with self._main_lock:
            spot = self.active_tickets.pop(license_number, None)
            if spot:
                spot.unpark_vehicle()
                print(f"Vehicle {license_number} unparked from spot {spot.get_spot_id()}")


# Demo
if __name__ == "__main__":
    lot = ParkingLot.get_instance()
    floor1 = ParkingFloor(1, [
        ParkingSpot("1A", "COMPACT"),
        ParkingSpot("1B", "COMPACT"),
        ParkingSpot("1C", "LARGE"),
    ])
    lot.add_floor(floor1)
    car1 = Car("ABC-123")
    car2 = Car("XYZ-789")
    lot.park_vehicle(car1)
    lot.park_vehicle(car2)
    lot.unpark_vehicle("ABC-123")`,
  },
  {
    id: 'vending-machine',
    title: 'Vending Machine',
    slug: 'vending-machine',
    difficulty: 'Medium',
    category: 'State Machine',
    description: 'Design a vending machine that supports multiple products, accepts different payment denominations, dispenses products, and returns change. Uses the State pattern to manage machine states.',
    requirements: [
      'Support multiple products with different prices and quantities',
      'Accept coins and notes of different denominations',
      'Dispense selected product and return change if necessary',
      'Track available products and their quantities',
      'Handle multiple transactions concurrently with data consistency',
      'Provide interface for restocking products and collecting money',
      'Handle exceptional scenarios like insufficient funds or out-of-stock',
    ],
    classes: ['VendingMachine (Singleton)', 'Product', 'Inventory', 'Coin (enum)', 'Note (enum)', 'VendingMachineState (interface)', 'IdleState', 'ReadyState', 'DispenseState'],
    patterns: ['Singleton', 'State', 'Strategy'],
    languages: ['Python', 'Java', 'C++', 'C#', 'Go', 'TypeScript'],
    diagramFile: 'vendingmachine-class-diagram.png',
    tags: ['State Pattern', 'Singleton', 'Concurrency'],
    pythonCode: `from enum import Enum
from typing import Dict, Optional

class Coin(Enum):
    PENNY = 1
    NICKEL = 5
    DIME = 10
    QUARTER = 25

class Product:
    def __init__(self, name: str, price: int, quantity: int):
        self.name = name
        self.price = price
        self.quantity = quantity

    def is_available(self) -> bool:
        return self.quantity > 0

    def dispense(self):
        if self.quantity > 0:
            self.quantity -= 1

class VendingMachineState:
    def insert_coin(self, machine, coin: Coin): pass
    def select_item(self, machine, code: str): pass
    def dispense(self, machine): pass

class IdleState(VendingMachineState):
    def insert_coin(self, machine, coin: Coin):
        machine.balance += coin.value
        print(f"Coin inserted: {coin.name}. Balance: {machine.balance}")
        machine.state = ReadyState()

    def select_item(self, machine, code: str):
        print("Please insert a coin first.")

class ReadyState(VendingMachineState):
    def insert_coin(self, machine, coin: Coin):
        machine.balance += coin.value
        print(f"Additional coin: {coin.name}. Balance: {machine.balance}")

    def select_item(self, machine, code: str):
        if code in machine.inventory:
            product = machine.inventory[code]
            if product.is_available():
                if machine.balance >= product.price:
                    machine.selected = code
                    machine.state = DispenseState()
                    print(f"Selected: {product.name}")
                else:
                    print(f"Insufficient funds. Need {product.price}, have {machine.balance}")
            else:
                print(f"{product.name} is out of stock")
        else:
            print("Invalid product code")

class DispenseState(VendingMachineState):
    def dispense(self, machine):
        product = machine.inventory[machine.selected]
        change = machine.balance - product.price
        product.dispense()
        machine.balance = 0
        machine.selected = None
        machine.state = IdleState()
        print(f"Dispensing {product.name}")
        if change > 0:
            print(f"Returning change: {change} cents")

class VendingMachine:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.inventory: Dict[str, Product] = {}
            cls._instance.state = IdleState()
            cls._instance.balance = 0
            cls._instance.selected = None
        return cls._instance

    def add_product(self, code: str, product: Product):
        self.inventory[code] = product

    def insert_coin(self, coin: Coin):
        self.state.insert_coin(self, coin)

    def select_item(self, code: str):
        self.state.select_item(self, code)

    def dispense(self):
        self.state.dispense(self)

# Demo
if __name__ == "__main__":
    vm = VendingMachine()
    vm.add_product("A1", Product("Cola", 50, 5))
    vm.add_product("A2", Product("Chips", 75, 3))
    vm.insert_coin(Coin.QUARTER)
    vm.insert_coin(Coin.QUARTER)
    vm.select_item("A1")
    vm.dispense()`,
  },
  {
    id: 'lru-cache',
    title: 'LRU Cache',
    slug: 'lru-cache',
    difficulty: 'Medium',
    category: 'Data Structures',
    description: 'Design an LRU (Least Recently Used) Cache with O(1) time complexity for both get and put operations using a combination of a hash map and a doubly linked list.',
    requirements: [
      'put(key, value): Insert key-value pair. If at capacity, remove least recently used item first',
      'get(key): Get value by key. Move to front (MRU position) if found, return -1 if not found',
      'Fixed capacity specified during initialization',
      'Thread-safe: allow concurrent access from multiple threads',
      'O(1) time complexity for both put and get operations',
    ],
    classes: ['Node', 'DoublyLinkedList', 'LRUCache'],
    patterns: ['None (Data Structure focus)'],
    languages: ['Python', 'Java', 'C++', 'C#', 'Go'],
    diagramFile: 'lrucache-class-diagram.png',
    tags: ['Data Structures', 'HashMap', 'LinkedList', 'Concurrency'],
    pythonCode: `import threading
from typing import TypeVar, Generic, Optional, Dict

K = TypeVar('K')
V = TypeVar('V')

class Node:
    def __init__(self, key, value):
        self.key = key
        self.value = value
        self.prev = None
        self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache: Dict = {}
        self.lock = threading.Lock()
        # Sentinel nodes
        self.head = Node(0, 0)  # Most recently used end
        self.tail = Node(0, 0)  # Least recently used end
        self.head.next = self.tail
        self.tail.prev = self.head

    def _remove(self, node: Node):
        node.prev.next = node.next
        node.next.prev = node.prev

    def _add_to_front(self, node: Node):
        node.next = self.head.next
        node.prev = self.head
        self.head.next.prev = node
        self.head.next = node

    def get(self, key) -> Optional[int]:
        with self.lock:
            if key not in self.cache:
                return None
            node = self.cache[key]
            self._remove(node)
            self._add_to_front(node)
            return node.value

    def put(self, key, value) -> None:
        with self.lock:
            if key in self.cache:
                node = self.cache[key]
                node.value = value
                self._remove(node)
                self._add_to_front(node)
            else:
                if len(self.cache) >= self.capacity:
                    # Remove LRU (tail.prev)
                    lru = self.tail.prev
                    self._remove(lru)
                    del self.cache[lru.key]
                new_node = Node(key, value)
                self._add_to_front(new_node)
                self.cache[key] = new_node

# Demo
if __name__ == "__main__":
    cache = LRUCache(3)
    cache.put(1, "one")
    cache.put(2, "two")
    cache.put(3, "three")
    print(cache.get(1))   # "one" - moves to front
    cache.put(4, "four")  # evicts key 2 (LRU)
    print(cache.get(2))   # None - was evicted
    print(cache.get(3))   # "three"
    print(cache.get(4))   # "four"`,
  },
  {
    id: 'stack-overflow',
    title: 'Stack Overflow',
    slug: 'stack-overflow',
    difficulty: 'Hard',
    category: 'Social Platform',
    description: 'Design a Q&A platform like Stack Overflow where users can post questions, answer them, comment, vote, and search. The system should manage reputation scores and handle concurrent access.',
    requirements: [
      'Users can post questions, answer questions, and comment on questions and answers',
      'Users can vote on questions and answers',
      'Questions should have tags associated with them',
      'Users can search for questions based on keywords, tags, or user profiles',
      'Assign reputation scores based on activity and contribution quality',
      'Handle concurrent access and ensure data consistency',
    ],
    classes: ['User', 'Question', 'Answer', 'Comment', 'Tag', 'Vote', 'StackOverflow (main)'],
    patterns: ['Singleton', 'Observer'],
    languages: ['Python', 'Java', 'C++', 'C#', 'Go', 'TypeScript'],
    diagramFile: 'stackoverflow-class-diagram.png',
    tags: ['Social Platform', 'Search', 'Reputation System', 'Concurrency'],
  },
  {
    id: 'logging-framework',
    title: 'Logging Framework',
    slug: 'logging-framework',
    difficulty: 'Easy',
    category: 'Infrastructure',
    description: 'Design a flexible logging framework supporting multiple log levels, various output destinations, thread-safe logging, and extensible configuration.',
    requirements: [
      'Support log levels: DEBUG, INFO, WARNING, ERROR, and FATAL',
      'Log messages with timestamp, log level, and message content',
      'Support multiple output destinations: console, file, and database',
      'Provide configuration mechanism to set log level and output destination',
      'Thread-safe to handle concurrent logging from multiple threads',
      'Extensible to accommodate new log levels and output destinations',
    ],
    classes: ['LogLevel (enum)', 'LogMessage', 'LogAppender (interface)', 'ConsoleAppender', 'FileAppender', 'DatabaseAppender', 'LoggerConfig', 'Logger (Singleton)'],
    patterns: ['Singleton', 'Strategy', 'Chain of Responsibility'],
    languages: ['Python', 'Java', 'C++', 'C#', 'Go', 'TypeScript'],
    diagramFile: 'loggingframework-class-diagram.png',
    tags: ['Infrastructure', 'Strategy Pattern', 'Singleton'],
  },
  {
    id: 'traffic-signal',
    title: 'Traffic Signal Control System',
    slug: 'traffic-signal',
    difficulty: 'Medium',
    category: 'System Design',
    description: 'Design a traffic signal control system that manages traffic flow at intersections with configurable signal durations, emergency handling, and smooth signal transitions.',
    requirements: [
      'Control traffic flow at an intersection with multiple roads',
      'Support different signal types: red, yellow, and green',
      'Configurable and adjustable signal duration based on traffic conditions',
      'Handle smooth transitions between signals for safe traffic flow',
      'Detect and handle emergency situations (ambulance, fire truck)',
      'Scalable and extensible for additional features',
    ],
    classes: ['Signal (enum)', 'Road', 'TrafficLight', 'TrafficController (Singleton)'],
    patterns: ['Singleton', 'Observer', 'State'],
    languages: ['Python', 'Java', 'C++', 'C#', 'Go', 'TypeScript'],
    diagramFile: 'trafficsignalsystem-class-diagram.png',
    tags: ['State Machine', 'Observer', 'Concurrency'],
  },
  {
    id: 'coffee-vending-machine',
    title: 'Coffee Vending Machine',
    slug: 'coffee-vending-machine',
    difficulty: 'Medium',
    category: 'State Machine',
    description: 'Design a coffee vending machine supporting different coffee types with specific recipes and prices. The machine tracks ingredients, handles payments, and notifies when ingredients run low.',
    requirements: [
      'Support coffee types: espresso, cappuccino, and latte',
      'Each coffee has a specific price and recipe (ingredients + quantities)',
      'Menu to display available coffee options and their prices',
      'Users can select coffee type and make payment',
      'Dispense selected coffee and provide change if necessary',
      'Track ingredient inventory and notify when running low',
      'Handle multiple user requests concurrently with thread safety',
    ],
    classes: ['Coffee', 'Ingredient', 'Payment', 'CoffeeMachine (Singleton)'],
    patterns: ['Singleton', 'Observer', 'Strategy'],
    languages: ['Python', 'Java', 'C++', 'C#', 'Go', 'TypeScript'],
    diagramFile: 'coffeevendingmachine-class-diagram.png',
    tags: ['Singleton', 'Observer', 'Inventory Management'],
  },
  {
    id: 'task-management-system',
    title: 'Task Management System',
    slug: 'task-management-system',
    difficulty: 'Medium',
    category: 'Productivity',
    description: 'Design a task management system (like Jira/Trello) where users can create, update, delete, and assign tasks with priorities, due dates, and status tracking.',
    requirements: [
      'Allow users to create, update, and delete tasks',
      'Each task has title, description, due date, priority, and status',
      'Assign tasks to other users and set reminders',
      'Support searching and filtering tasks by priority, due date, assigned user',
      'Mark tasks as completed and view task history',
      'Handle concurrent access and ensure data consistency',
      'Extensible to accommodate future enhancements',
    ],
    classes: ['User', 'Task', 'TaskStatus (enum)', 'TaskManager (Singleton)'],
    patterns: ['Singleton', 'Observer', 'Iterator'],
    languages: ['Python', 'Java', 'C++', 'C#', 'Go', 'TypeScript'],
    diagramFile: 'taskmanagementsystem-class-diagram.png',
    tags: ['CRUD', 'Filtering', 'Singleton', 'Concurrency'],
  },
  {
    id: 'atm',
    title: 'ATM System',
    slug: 'atm',
    difficulty: 'Medium',
    category: 'Banking',
    description: 'Design an ATM system supporting balance inquiry, cash withdrawal, and cash deposit with card authentication, PIN validation, and interaction with a bank backend.',
    requirements: [
      'Support basic operations: balance inquiry, cash withdrawal, and cash deposit',
      'Authenticate users using a card and PIN',
      'Interact with bank backend to validate accounts and perform transactions',
      'ATM has a cash dispenser to dispense cash',
      'Handle concurrent access and ensure data consistency',
      'User-friendly interface for interactions',
    ],
    classes: ['Card', 'Account', 'Transaction (abstract)', 'WithdrawalTransaction', 'DepositTransaction', 'BankingService', 'CashDispenser', 'ATM'],
    patterns: ['Singleton', 'State', 'Strategy', 'Command'],
    languages: ['Python', 'Java', 'C++', 'C#', 'Go'],
    diagramFile: 'atm-class-diagram.png',
    tags: ['Banking', 'State Machine', 'Security', 'Concurrency'],
  },
  {
    id: 'tic-tac-toe',
    title: 'Tic Tac Toe Game',
    slug: 'tic-tac-toe',
    difficulty: 'Easy',
    category: 'Games',
    description: 'Design a Tic Tac Toe game with a 3x3 grid, two players, move validation, win detection, and draw detection.',
    requirements: [
      'Game played on a 3x3 grid',
      'Two players take turns marking symbols (X or O)',
      'First player with three symbols in a row (horizontal, vertical, diagonal) wins',
      'If grid is full with no winner, game ends in a draw',
      'User interface to display grid and allow moves',
      'Handle player turns and validate moves for legality',
      'Detect and announce winner or draw at game end',
    ],
    classes: ['Player', 'Board', 'Game', 'TicTacToe (entry point)'],
    patterns: ['Strategy', 'Iterator'],
    languages: ['Python', 'Java', 'C++', 'C#', 'Go'],
    diagramFile: 'tictactoe-class-diagram.png',
    tags: ['Games', 'Board Game', 'OOP Basics'],
  },
  {
    id: 'pub-sub-system',
    title: 'Pub-Sub System',
    slug: 'pub-sub-system',
    difficulty: 'Medium',
    category: 'Messaging',
    description: 'Design a Publisher-Subscriber messaging system where publishers publish messages to topics and subscribers receive messages in real-time.',
    requirements: [
      'Publishers can publish messages to specific topics',
      'Subscribers can subscribe to topics and receive published messages',
      'Support multiple publishers and subscribers',
      'Messages delivered to all subscribers of a topic in real-time',
      'Handle concurrent access and ensure thread safety',
      'Scalable and efficient message delivery',
    ],
    classes: ['Message', 'Topic', 'Subscriber (interface)', 'PrintSubscriber', 'Publisher', 'PubSubSystem'],
    patterns: ['Observer', 'Mediator'],
    languages: ['Python', 'Java', 'C++', 'C#', 'Go'],
    diagramFile: 'pubsubsystem-class-diagram.png',
    tags: ['Messaging', 'Observer Pattern', 'Concurrency', 'Event-Driven'],
  },
  {
    id: 'elevator-system',
    title: 'Elevator System',
    slug: 'elevator-system',
    difficulty: 'Hard',
    category: 'System Design',
    description: 'Design an elevator system with multiple elevators serving multiple floors. The system should efficiently handle user requests, optimize elevator movement, and ensure thread safety.',
    requirements: [
      'Multiple elevators serving multiple floors',
      'Each elevator has a capacity limit',
      'Users can request elevator from any floor and select destination',
      'Efficiently handle requests and optimize movement to minimize waiting time',
      'Prioritize requests based on direction of travel and elevator proximity',
      'Handle multiple requests concurrently in optimal order',
      'Ensure thread safety and prevent race conditions',
    ],
    classes: ['Direction (enum)', 'Request', 'Elevator', 'ElevatorController', 'ElevatorSystem'],
    patterns: ['Strategy', 'Observer', 'Command'],
    languages: ['Python', 'Java', 'C++', 'C#', 'Go'],
    diagramFile: 'elevatorsystem-class-diagram.png',
    tags: ['Scheduling', 'Optimization', 'Concurrency', 'Strategy Pattern'],
  },
  {
    id: 'hotel-management-system',
    title: 'Hotel Management System',
    slug: 'hotel-management-system',
    difficulty: 'Hard',
    category: 'Business Systems',
    description: 'Design a hotel management system for booking rooms, check-in/check-out, managing guest information, and processing payments with multiple payment methods.',
    requirements: [
      'Allow guests to book rooms, check-in, and check-out',
      'Manage different room types: single, double, deluxe, and suite',
      'Handle room availability and reservation status',
      'Allow staff to manage guest information, room assignments, and billing',
      'Support multiple payment methods: cash, credit card, online payment',
      'Handle concurrent bookings and ensure data consistency',
      'Provide reporting and analytics features',
      'Scalable for large numbers of rooms and guests',
    ],
    classes: ['Guest', 'Room', 'RoomType (enum)', 'RoomStatus (enum)', 'Reservation', 'ReservationStatus (enum)', 'Payment (interface)', 'CashPayment', 'CreditCardPayment', 'HotelManagementSystem (Singleton)'],
    patterns: ['Singleton', 'Strategy', 'Observer'],
    languages: ['Python', 'Java', 'C++', 'C#', 'Go'],
    diagramFile: 'hotelmanagementsystem-class-diagram.png',
    tags: ['Business System', 'Booking', 'Payment', 'Concurrency'],
  },
  {
    id: 'library-management-system',
    title: 'Library Management System',
    slug: 'library-management-system',
    difficulty: 'Medium',
    category: 'Business Systems',
    description: 'Design a library management system for managing books, members, and borrowing activities with proper enforcement of borrowing rules.',
    requirements: [
      'Allow librarians to manage books, members, and borrowing activities',
      'Support adding, updating, and removing books from the catalog',
      'Book details: title, author, ISBN, publication year, availability status',
      'Allow members to borrow and return books',
      'Member details: name, member ID, contact info, borrowing history',
      'Enforce borrowing rules: maximum books and loan duration',
      'Handle concurrent access to catalog and member records',
      'Extensible for future enhancements',
    ],
    classes: ['Book', 'Member', 'LibraryManager (Singleton)'],
    patterns: ['Singleton', 'Iterator', 'Observer'],
    languages: ['Python', 'Java', 'C++', 'C#', 'Go'],
    diagramFile: 'librarymanagementsystem-class-diagram.png',
    tags: ['CRUD', 'Business System', 'Search', 'Concurrency'],
  },
  {
    id: 'social-networking-service',
    title: 'Social Networking Service',
    slug: 'social-networking-service',
    difficulty: 'Hard',
    category: 'Social Platform',
    description: 'Design a social networking platform like Facebook with user profiles, friend connections, posts, newsfeed, likes, comments, and real-time notifications.',
    requirements: [
      'User registration, authentication, and profile management',
      'User profiles with picture, bio, and interests',
      'Friend connections: send, accept, or decline friend requests',
      'Posts with text, images, or videos; newsfeed in reverse chronological order',
      'Likes and comments on posts',
      'Privacy controls for posts and profile visibility',
      'Real-time notifications for friend requests, likes, comments, and mentions',
      'Scalable for large number of concurrent users',
    ],
    classes: ['User', 'Post', 'Comment', 'Notification', 'NotificationType (enum)', 'SocialNetworkingService (Singleton)'],
    patterns: ['Singleton', 'Observer', 'Iterator'],
    languages: ['Python', 'Java', 'C++', 'C#', 'Go'],
    diagramFile: 'socialnetworkingservice-class-diagram.png',
    tags: ['Social Platform', 'Newsfeed', 'Notifications', 'Scalability'],
  },
  {
    id: 'restaurant-management-system',
    title: 'Restaurant Management System',
    slug: 'restaurant-management-system',
    difficulty: 'Hard',
    category: 'Business Systems',
    description: 'Design a restaurant management system handling menu management, order processing, reservations, payment, and staff management with reporting capabilities.',
    requirements: [
      'Allow customers to place orders, view menu, and make reservations',
      'Manage restaurant inventory including ingredients and menu items',
      'Handle order processing: preparation, billing, and payment',
      'Support multiple payment methods: cash, credit card, mobile payments',
      'Manage staff information: roles, schedules, and performance tracking',
      'Generate reports and analytics for management',
      'Handle concurrent access and ensure data consistency',
    ],
    classes: ['MenuItem', 'Order', 'OrderStatus (enum)', 'Reservation', 'Payment', 'PaymentMethod (enum)', 'Staff', 'Restaurant (Singleton)'],
    patterns: ['Singleton', 'Observer', 'Command', 'Strategy'],
    languages: ['Python', 'Java', 'C++', 'C#', 'Go'],
    diagramFile: 'restaurantmanagementsystem-class-diagram.png',
    tags: ['Business System', 'Order Management', 'Inventory', 'Payment'],
  },
  {
    id: 'splitwise',
    title: 'Splitwise',
    slug: 'splitwise',
    difficulty: 'Hard',
    category: 'Finance',
    description: 'Design a bill-splitting application like Splitwise where users create groups, add expenses, automatically split them, track balances, and settle up.',
    requirements: [
      'Allow users to create accounts and manage profile information',
      'Create groups and add other users to groups',
      'Add expenses within a group: amount, description, and participants',
      'Automatically split expenses among participants based on their share',
      'View individual balances with other users and settle up',
      'Support different split methods: equal, percentage, and exact amounts',
      'View transaction history and group expenses',
      'Handle concurrent transactions and ensure data consistency',
    ],
    classes: ['User', 'Group', 'Expense', 'Split (abstract)', 'EqualSplit', 'PercentSplit', 'ExactSplit', 'Transaction', 'SplitwiseService (Singleton)'],
    patterns: ['Singleton', 'Strategy', 'Observer'],
    languages: ['Python', 'Java', 'C++', 'C#', 'Go'],
    diagramFile: 'splitwise-class-diagram.png',
    tags: ['Finance', 'Strategy Pattern', 'Group Management', 'Transactions'],
  },
  {
    id: 'chess-game',
    title: 'Chess Game',
    slug: 'chess-game',
    difficulty: 'Hard',
    category: 'Games',
    description: 'Design a chess game following standard rules with two players, an 8x8 board, all piece types with their movement rules, checkmate/stalemate detection.',
    requirements: [
      'Follow standard rules of chess',
      'Two players controlling their own set of pieces',
      '8x8 board with alternating black and white squares',
      'Each player has 16 pieces: 1 king, 1 queen, 2 rooks, 2 bishops, 2 knights, 8 pawns',
      'Validate legal moves for each piece and prevent illegal moves',
      'Detect checkmate and stalemate conditions',
      'Handle player turns and allow alternating moves',
      'User interface for player interaction',
    ],
    classes: ['Piece (abstract)', 'King', 'Queen', 'Rook', 'Bishop', 'Knight', 'Pawn', 'Board', 'Player', 'Move', 'Game'],
    patterns: ['Strategy', 'Command', 'Template Method'],
    languages: ['Python', 'Java', 'C++', 'C#', 'Go'],
    diagramFile: 'chessgame-class-diagram.png',
    tags: ['Games', 'Board Game', 'Strategy Pattern', 'OOP'],
  },
  {
    id: 'snake-and-ladder',
    title: 'Snake and Ladder Game',
    slug: 'snake-and-ladder',
    difficulty: 'Easy',
    category: 'Games',
    description: 'Design a Snake and Ladder game with a 100-cell board, multiple players, snakes and ladders, dice rolling, and support for concurrent game sessions.',
    requirements: [
      'Board with numbered cells (100 cells)',
      'Predefined set of snakes and ladders connecting certain cells',
      'Support multiple players with unique game pieces',
      'Players take turns rolling a dice to move forward',
      'Landing on snake head slides down to tail; ladder base climbs to top',
      'Game continues until a player reaches the final cell',
      'Handle multiple concurrent game sessions for different player groups',
    ],
    classes: ['Board', 'Player', 'Snake', 'Ladder', 'Dice', 'SnakeAndLadderGame', 'GameManager (Singleton)'],
    patterns: ['Singleton', 'Command', 'Observer'],
    languages: ['Python', 'Java', 'C++', 'C#', 'Go'],
    diagramFile: 'snakeandladdergame-class-diagram.png',
    tags: ['Games', 'Board Game', 'Concurrency', 'OOP Basics'],
  },
  {
    id: 'ride-sharing-service',
    title: 'Ride Sharing Service',
    slug: 'ride-sharing-service',
    difficulty: 'Hard',
    category: 'On-Demand Services',
    description: 'Design a ride-sharing service like Uber with passenger requests, driver matching, fare calculation, real-time tracking, and concurrent request handling.',
    requirements: [
      'Passengers can request rides; drivers can accept and fulfill ride requests',
      'Passengers specify pickup location, destination, and ride type',
      'Drivers can see available ride requests and choose to accept or decline',
      'Match ride requests with available drivers based on proximity',
      'Calculate fare based on distance, time, and ride type',
      'Handle payments and process transactions',
      'Provide real-time tracking and status updates',
      'Handle concurrent requests and ensure data consistency',
    ],
    classes: ['Passenger', 'Driver', 'Ride', 'Location', 'Payment', 'RideService (Singleton)'],
    patterns: ['Singleton', 'Observer', 'Strategy'],
    languages: ['Python', 'Java', 'C++', 'C#', 'Go'],
    diagramFile: 'ridesharingservice-class-diagram.png',
    tags: ['On-Demand', 'Real-time Tracking', 'Matching Algorithm', 'Payments'],
  },
  {
    id: 'movie-ticket-booking',
    title: 'Movie Ticket Booking System',
    slug: 'movie-ticket-booking',
    difficulty: 'Hard',
    category: 'Booking Systems',
    description: 'Design a movie ticket booking system like BookMyShow with theater management, seat selection, concurrent booking handling, and multiple seat types.',
    requirements: [
      'Users can view list of movies playing in different theaters',
      'Select movie, theater, and show timing to book tickets',
      'Display seating arrangement and allow seat selection',
      'Handle payments and confirm bookings',
      'Handle concurrent bookings with real-time seat availability',
      'Support different seat types (normal, premium) and pricing',
      'Allow administrators to manage movies, shows, and seating',
      'Scalable for large number of concurrent users',
    ],
    classes: ['Movie', 'Theater', 'Show', 'Seat', 'SeatType (enum)', 'SeatStatus (enum)', 'Booking', 'BookingStatus (enum)', 'User', 'MovieTicketBookingSystem (Singleton)'],
    patterns: ['Singleton', 'Observer', 'Strategy'],
    languages: ['Python', 'Java', 'C++', 'C#', 'Go'],
    diagramFile: 'movieticketbookingsystem-class-diagram.png',
    tags: ['Booking System', 'Concurrency', 'Seat Management', 'Payments'],
  },
  {
    id: 'online-shopping-service',
    title: 'Online Shopping Service',
    slug: 'online-shopping-service',
    difficulty: 'Hard',
    category: 'E-Commerce',
    description: 'Design an online shopping system like Amazon with product browsing, cart management, order processing, inventory management, and secure payments.',
    requirements: [
      'Allow users to browse products, add to cart, and place orders',
      'Support multiple product categories with search functionality',
      'Users can manage profiles, view order history, and track status',
      'Handle inventory management and update product availability',
      'Support multiple payment methods with secure transactions',
      'Handle concurrent user requests and ensure data consistency',
      'Scalable for large numbers of products and users',
    ],
    classes: ['User', 'Product', 'Order', 'OrderItem', 'OrderStatus (enum)', 'ShoppingCart', 'Payment (interface)', 'CreditCardPayment', 'OnlineShoppingService (Singleton)'],
    patterns: ['Singleton', 'Strategy', 'Observer', 'Iterator'],
    languages: ['Python', 'Java', 'C++', 'C#', 'Go'],
    diagramFile: 'onlineshoppingservice-class-diagram.png',
    tags: ['E-Commerce', 'Inventory', 'Payment', 'Search'],
  },
  {
    id: 'music-streaming-service',
    title: 'Music Streaming Service',
    slug: 'music-streaming-service',
    difficulty: 'Hard',
    category: 'Media Streaming',
    description: 'Design a music streaming service like Spotify with song browsing, playlist management, music playback, and recommendations based on user preferences.',
    requirements: [
      'Allow users to browse and search for songs, albums, and artists',
      'Create and manage playlists',
      'Support user authentication and authorization',
      'Play, pause, skip, and seek within songs',
      'Recommend songs and playlists based on user preferences',
      'Handle concurrent requests for smooth streaming experience',
      'Scalable for large volume of songs and users',
    ],
    classes: ['Song', 'Album', 'Artist', 'User', 'Playlist', 'MusicLibrary (Singleton)', 'UserManager (Singleton)', 'MusicPlayer', 'MusicRecommender (Singleton)'],
    patterns: ['Singleton', 'Observer', 'Strategy', 'Iterator'],
    languages: ['Python', 'Java', 'C++', 'C#', 'Go'],
    diagramFile: 'musicstreamingservice-class-diagram.png',
    tags: ['Media', 'Streaming', 'Recommendations', 'Search'],
  },
  {
    id: 'food-delivery-service',
    title: 'Food Delivery Service',
    slug: 'food-delivery-service',
    difficulty: 'Hard',
    category: 'On-Demand Services',
    description: 'Design a food delivery service like Swiggy/DoorDash with restaurant browsing, order placement, delivery agent assignment, tracking, and real-time notifications.',
    requirements: [
      'Customers can browse restaurants, view menus, and place orders',
      'Restaurants can manage menus, prices, and availability',
      'Delivery agents can accept and fulfill orders',
      'Handle order tracking and status updates',
      'Support multiple payment methods',
      'Handle concurrent orders and ensure data consistency',
      'Scalable for high volume of orders',
      'Real-time notifications to customers, restaurants, and delivery agents',
    ],
    classes: ['Customer', 'Restaurant', 'MenuItem', 'Order', 'OrderItem', 'OrderStatus (enum)', 'DeliveryAgent', 'FoodDeliveryService (Singleton)'],
    patterns: ['Singleton', 'Observer', 'Strategy', 'Command'],
    languages: ['Python', 'Java', 'C++', 'C#', 'Go'],
    diagramFile: 'fooddeliveryservice-class-diagram.png',
    tags: ['On-Demand', 'Food Tech', 'Notifications', 'Delivery Tracking'],
  },
];

export function getProblemBySlug(slug: string): Problem | undefined {
  return problems.find((p) => p.slug === slug);
}

export function getProblemsByDifficulty(difficulty: string): Problem[] {
  if (difficulty === 'All') return problems;
  return problems.filter((p) => p.difficulty === difficulty);
}
