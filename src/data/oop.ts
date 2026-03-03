export interface OOPConcept {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  keyPoints: string[];
  pythonCode: string;
  realWorldExample: string;
}

export const oopConcepts: OOPConcept[] = [
  {
    id: 'encapsulation',
    title: 'Encapsulation',
    slug: 'encapsulation',
    category: 'Core Pillar',
    description: 'Encapsulation is the bundling of data (attributes) and methods that operate on that data into a single unit (class), and restricting direct access to some of the object\'s components. It\'s about hiding internal state and requiring all interaction to be performed through an object\'s methods.',
    keyPoints: [
      'Data hiding: restrict access to internal state using private/protected members',
      'Access control: provide public methods (getters/setters) to control access',
      'Implementation independence: change internals without affecting external code',
      'Reduces complexity: users interact through a simple interface',
      'Increases security: prevents unauthorized access to internal data',
    ],
    pythonCode: `class BankAccount:
    """
    Encapsulation example: Bank account hides balance
    and controls access through methods
    """

    def __init__(self, account_id: str, initial_balance: float = 0):
        self.__account_id = account_id       # Private
        self.__balance = initial_balance      # Private
        self.__transactions = []              # Private

    @property
    def account_id(self) -> str:
        return self.__account_id

    @property
    def balance(self) -> float:
        return self.__balance

    def deposit(self, amount: float) -> None:
        if amount <= 0:
            raise ValueError("Deposit amount must be positive")
        self.__balance += amount
        self.__transactions.append(("deposit", amount))
        print(f"Deposited {amount:.2f}. New balance: {self.__balance:.2f}")

    def withdraw(self, amount: float) -> None:
        if amount <= 0:
            raise ValueError("Withdrawal amount must be positive")
        if amount > self.__balance:
            raise ValueError(f"Insufficient funds. Balance: {self.__balance:.2f}")
        self.__balance -= amount
        self.__transactions.append(("withdrawal", amount))
        print(f"Withdrew {amount:.2f}. New balance: {self.__balance:.2f}")

    def get_statement(self) -> list:
        return self.__transactions.copy()  # Return copy to maintain encapsulation


# Usage
account = BankAccount("ACC-001", 1000)
account.deposit(500)
account.withdraw(200)
print(f"Balance: {account.balance:.2f}")

# Cannot access private members directly
# account.__balance = 999999  # AttributeError!
# print(account.__transactions)  # AttributeError!`,
    realWorldExample: 'A bank account encapsulates the balance and transaction history. You can only deposit or withdraw through official methods, which validate inputs and maintain proper records. You cannot directly set your bank balance to any number you want.',
  },
  {
    id: 'inheritance',
    title: 'Inheritance',
    slug: 'inheritance',
    category: 'Core Pillar',
    description: 'Inheritance is a mechanism where a new class (subclass/derived class) acquires properties and behaviors of an existing class (superclass/base class). It enables code reuse and establishes an IS-A relationship between classes.',
    keyPoints: [
      'Code reuse: subclasses inherit attributes and methods from parent classes',
      'IS-A relationship: a Dog IS-A Animal (meaningful hierarchy)',
      'Method overriding: subclasses can change parent class behavior',
      'Single vs Multiple inheritance: Python supports both, Java only single',
      'super() keyword: call parent class methods from child class',
      'Abstract classes: define interface that subclasses must implement',
    ],
    pythonCode: `from abc import ABC, abstractmethod


class Animal(ABC):
    """Abstract base class"""

    def __init__(self, name: str, age: int):
        self.name = name
        self.age = age

    @abstractmethod
    def speak(self) -> str:
        """Subclasses must implement this"""
        pass

    def breathe(self) -> str:
        return f"{self.name} breathes air"

    def __str__(self) -> str:
        return f"{type(self).__name__}(name={self.name}, age={self.age})"


class Dog(Animal):
    def __init__(self, name: str, age: int, breed: str):
        super().__init__(name, age)  # Call parent constructor
        self.breed = breed

    def speak(self) -> str:
        return f"{self.name} says: Woof!"

    def fetch(self) -> str:
        return f"{self.name} fetches the ball!"


class Cat(Animal):
    def __init__(self, name: str, age: int, indoor: bool = True):
        super().__init__(name, age)
        self.indoor = indoor

    def speak(self) -> str:
        return f"{self.name} says: Meow!"

    def purr(self) -> str:
        return f"{self.name} purrs contentedly"


class GuideDog(Dog):
    """Multi-level inheritance"""

    def __init__(self, name: str, age: int, breed: str, owner: str):
        super().__init__(name, age, breed)
        self.owner = owner

    def guide(self) -> str:
        return f"{self.name} guides {self.owner} safely"


# Usage
dog = Dog("Rex", 3, "Labrador")
cat = Cat("Whiskers", 5)
guide = GuideDog("Buddy", 4, "Golden Retriever", "John")

animals = [dog, cat, guide]

for animal in animals:
    print(animal)
    print(f"  - {animal.speak()}")
    print(f"  - {animal.breathe()}")

print(f"Guide dog: {guide.guide()}")
print(f"Is GuideDog a Dog? {isinstance(guide, Dog)}")
print(f"Is GuideDog an Animal? {isinstance(guide, Animal)}")`,
    realWorldExample: 'A Vehicle hierarchy: Car, Truck, and Motorcycle all inherit from Vehicle. They all share common properties like speed, fuel, and engine, but each has specific behaviors. A Car has passengers, a Truck has cargo capacity, and a Motorcycle has no doors.',
  },
  {
    id: 'polymorphism',
    title: 'Polymorphism',
    slug: 'polymorphism',
    category: 'Core Pillar',
    description: 'Polymorphism (many forms) allows objects of different types to be treated as objects of a common type. The same interface can be used to represent different underlying forms (data types or classes). It enables a single function to work with objects of different classes.',
    keyPoints: [
      'Method overriding: subclass provides specific implementation of parent method',
      'Method overloading: same method name with different parameters (Python uses default args)',
      'Duck typing: if it walks like a duck and quacks like a duck, it is a duck',
      'Compile-time polymorphism: method overloading',
      'Runtime polymorphism: method overriding via virtual methods',
      'Enables writing generic code that works with multiple types',
    ],
    pythonCode: `from abc import ABC, abstractmethod
from typing import List
import math


class Shape(ABC):
    """Abstract base class for polymorphism"""

    @abstractmethod
    def area(self) -> float:
        pass

    @abstractmethod
    def perimeter(self) -> float:
        pass

    def describe(self) -> str:
        """Template method using polymorphic methods"""
        return (f"{type(self).__name__}: "
                f"area={self.area():.2f}, "
                f"perimeter={self.perimeter():.2f}")


class Circle(Shape):
    def __init__(self, radius: float):
        self.radius = radius

    def area(self) -> float:
        return math.pi * self.radius ** 2

    def perimeter(self) -> float:
        return 2 * math.pi * self.radius


class Rectangle(Shape):
    def __init__(self, width: float, height: float):
        self.width = width
        self.height = height

    def area(self) -> float:
        return self.width * self.height

    def perimeter(self) -> float:
        return 2 * (self.width + self.height)


class Triangle(Shape):
    def __init__(self, a: float, b: float, c: float):
        self.a, self.b, self.c = a, b, c

    def area(self) -> float:
        s = self.perimeter() / 2
        return math.sqrt(s * (s-self.a) * (s-self.b) * (s-self.c))

    def perimeter(self) -> float:
        return self.a + self.b + self.c


def total_area(shapes: List[Shape]) -> float:
    """Polymorphic function - works with any Shape subclass"""
    return sum(shape.area() for shape in shapes)

def print_all_descriptions(shapes: List[Shape]):
    """Same method called on different object types"""
    for shape in shapes:
        print(shape.describe())  # Runtime polymorphism


# Duck typing example
class Square:
    """Does NOT inherit from Shape but has same interface"""
    def __init__(self, side: float):
        self.side = side

    def area(self) -> float:
        return self.side ** 2

    def perimeter(self) -> float:
        return 4 * self.side


# Usage
shapes: List[Shape] = [
    Circle(5),
    Rectangle(4, 6),
    Triangle(3, 4, 5),
]

print_all_descriptions(shapes)
print(f"\\nTotal area: {total_area(shapes):.2f}")`,
    realWorldExample: 'A payment system processes Credit Card, PayPal, and Bitcoin payments. All payment types implement the same pay() method, but each processes the payment differently. The checkout code calls pay() without needing to know which payment method is used.',
  },
  {
    id: 'abstraction',
    title: 'Abstraction',
    slug: 'abstraction',
    category: 'Core Pillar',
    description: 'Abstraction is the process of hiding complex implementation details and showing only the necessary features of an object. It focuses on what an object does rather than how it does it. Abstraction is achieved through abstract classes and interfaces.',
    keyPoints: [
      'Abstract classes: define a common interface for subclasses',
      'Interfaces: define a contract (pure abstraction) for implementing classes',
      'Focus on WHAT not HOW: hide implementation details',
      'Reduces complexity: users interact with simplified interface',
      'Enables loose coupling: depend on abstractions, not implementations',
      'Foundation for Dependency Inversion Principle (DIP)',
    ],
    pythonCode: `from abc import ABC, abstractmethod
from typing import Optional


# Abstract interface for payment
class PaymentGateway(ABC):
    """Abstraction - defines WHAT operations are available"""

    @abstractmethod
    def charge(self, amount: float, currency: str) -> bool:
        """Charge the customer"""
        pass

    @abstractmethod
    def refund(self, transaction_id: str, amount: float) -> bool:
        """Refund a transaction"""
        pass

    @abstractmethod
    def get_balance(self) -> float:
        """Get available balance"""
        pass


# Concrete implementations - HOW it's actually done
class StripeGateway(PaymentGateway):
    def charge(self, amount: float, currency: str) -> bool:
        # Complex Stripe API integration hidden
        print(f"[Stripe] Charging {amount:.2f} {currency}")
        # stripe.charge.create(amount=amount, currency=currency)
        return True

    def refund(self, transaction_id: str, amount: float) -> bool:
        print(f"[Stripe] Refunding {amount:.2f} for {transaction_id}")
        return True

    def get_balance(self) -> float:
        print("[Stripe] Fetching balance from Stripe API")
        return 10000.00


class PayPalGateway(PaymentGateway):
    def charge(self, amount: float, currency: str) -> bool:
        # Complex PayPal API integration hidden
        print(f"[PayPal] Processing payment of {amount:.2f} {currency}")
        return True

    def refund(self, transaction_id: str, amount: float) -> bool:
        print(f"[PayPal] Initiating refund for {transaction_id}")
        return True

    def get_balance(self) -> float:
        print("[PayPal] Fetching PayPal balance")
        return 5000.00


# High-level service depends on abstraction, not implementation
class OrderPaymentService:
    def __init__(self, gateway: PaymentGateway):
        self._gateway = gateway  # Depends on abstraction

    def process_order(self, order_id: str, amount: float) -> bool:
        print(f"Processing order {order_id} for {amount:.2f}")
        success = self._gateway.charge(amount, "USD")
        if success:
            print(f"Order {order_id} payment successful!")
        return success


# Same code works with any PaymentGateway implementation
stripe_service = OrderPaymentService(StripeGateway())
stripe_service.process_order("ORD-001", 99.99)

paypal_service = OrderPaymentService(PayPalGateway())
paypal_service.process_order("ORD-002", 149.99)`,
    realWorldExample: 'When you drive a car, you use the steering wheel, pedals, and gear shift. You do not need to know how the internal combustion engine, transmission, or braking system work internally. The car provides an abstract interface (controls) that hides all the complex machinery.',
  },
  {
    id: 'solid-principles',
    title: 'SOLID Principles',
    slug: 'solid-principles',
    category: 'Design Principles',
    description: 'SOLID is an acronym for five design principles that make software designs more understandable, flexible, and maintainable. These principles are guidelines for writing object-oriented code that is easy to extend and modify.',
    keyPoints: [
      'S - Single Responsibility Principle: A class should have only one reason to change',
      'O - Open/Closed Principle: Open for extension, closed for modification',
      'L - Liskov Substitution Principle: Subtypes must be substitutable for their base types',
      'I - Interface Segregation Principle: Many specific interfaces are better than one general interface',
      'D - Dependency Inversion Principle: Depend on abstractions, not concretions',
    ],
    pythonCode: `from abc import ABC, abstractmethod
from typing import List


# S - Single Responsibility Principle
class UserRepository:
    """Only responsible for user data persistence"""
    def save(self, user: dict) -> bool:
        print(f"Saving user to database: {user['name']}")
        return True

class EmailService:
    """Only responsible for sending emails"""
    def send_welcome_email(self, email: str) -> bool:
        print(f"Sending welcome email to: {email}")
        return True

class UserRegistrationService:
    """Orchestrates registration using focused classes"""
    def __init__(self, repo: UserRepository, email: EmailService):
        self.repo = repo
        self.email = email

    def register(self, name: str, email: str) -> bool:
        user = {"name": name, "email": email}
        if self.repo.save(user):
            self.email.send_welcome_email(email)
            return True
        return False


# O - Open/Closed Principle
class Discount(ABC):
    @abstractmethod
    def apply(self, price: float) -> float:
        pass

class NoDiscount(Discount):
    def apply(self, price: float) -> float:
        return price

class PercentageDiscount(Discount):
    def __init__(self, percent: float):
        self.percent = percent

    def apply(self, price: float) -> float:
        return price * (1 - self.percent / 100)

# New discount types added without modifying existing code
class SeasonalDiscount(Discount):
    def apply(self, price: float) -> float:
        return price * 0.8  # 20% off


# L - Liskov Substitution Principle
class Bird(ABC):
    @abstractmethod
    def move(self) -> str:
        pass

class FlyingBird(Bird):
    def move(self) -> str:
        return "I fly!"

class SwimmingBird(Bird):
    def move(self) -> str:
        return "I swim!"

# NOT: class Penguin(FlyingBird) - penguins can't fly!
# CORRECT: class Penguin(SwimmingBird)


# I - Interface Segregation Principle
class Printable(ABC):
    @abstractmethod
    def print_doc(self): pass

class Scannable(ABC):
    @abstractmethod
    def scan_doc(self): pass

class Faxable(ABC):
    @abstractmethod
    def fax_doc(self): pass

# Printer only implements what it supports
class SimplePrinter(Printable):
    def print_doc(self):
        print("Printing document...")

# All-in-one implements all interfaces it supports
class AllInOnePrinter(Printable, Scannable, Faxable):
    def print_doc(self): print("Printing...")
    def scan_doc(self): print("Scanning...")
    def fax_doc(self): print("Faxing...")


# D - Dependency Inversion Principle
class Logger(ABC):
    @abstractmethod
    def log(self, message: str): pass

class ConsoleLogger(Logger):
    def log(self, message: str):
        print(f"[Console] {message}")

class FileLogger(Logger):
    def log(self, message: str):
        print(f"[File] Writing: {message}")

# High-level module depends on Logger abstraction, not concrete class
class OrderService:
    def __init__(self, logger: Logger):  # Inject dependency
        self.logger = logger

    def place_order(self, item: str):
        self.logger.log(f"Order placed: {item}")
        return True

# Switch implementation without changing OrderService
service = OrderService(ConsoleLogger())
service.place_order("Laptop")

service2 = OrderService(FileLogger())
service2.place_order("Mouse")`,
    realWorldExample: 'A well-designed e-commerce system follows SOLID: Order class only handles order logic (SRP), new payment methods added without changing Order (OCP), different payment types are interchangeable (LSP), PaymentProcessor interface is focused (ISP), Order depends on PaymentProcessor interface not Stripe directly (DIP).',
  },
  {
    id: 'composition-vs-inheritance',
    title: 'Composition vs Inheritance',
    slug: 'composition-vs-inheritance',
    category: 'Design Principles',
    description: 'Composition and Inheritance are two fundamental approaches to code reuse in OOP. "Favor composition over inheritance" is a key design principle because composition provides more flexibility and reduces coupling.',
    keyPoints: [
      'Inheritance: IS-A relationship (Dog IS-A Animal)',
      'Composition: HAS-A relationship (Car HAS-A Engine)',
      'Composition is more flexible: behavior can change at runtime',
      'Inheritance creates tight coupling: child depends on parent internals',
      'Composition avoids the fragile base class problem',
      '"Favor composition over inheritance" - Gang of Four principle',
      'Composition promotes single responsibility and loose coupling',
    ],
    pythonCode: `from abc import ABC, abstractmethod


# INHERITANCE approach (problematic)
class Animal:
    def breathe(self) -> str:
        return "Breathing air"

class Bird(Animal):
    def fly(self) -> str:
        return "Flying with wings"

class Penguin(Bird):  # Problem: Penguins can't fly!
    def fly(self) -> str:
        raise NotImplementedError("Penguins can't fly!")  # Violates LSP


# COMPOSITION approach (flexible)
class FlyBehavior(ABC):
    @abstractmethod
    def fly(self) -> str:
        pass

class SwimBehavior(ABC):
    @abstractmethod
    def swim(self) -> str:
        pass

class CanFly(FlyBehavior):
    def fly(self) -> str:
        return "Flying with wings!"

class CannotFly(FlyBehavior):
    def fly(self) -> str:
        return "Cannot fly"

class CanSwim(SwimBehavior):
    def swim(self) -> str:
        return "Swimming!"

class CannotSwim(SwimBehavior):
    def swim(self) -> str:
        return "Cannot swim"


class Duck:
    """Uses composition - HAS-A fly behavior and swim behavior"""
    def __init__(self):
        self.fly_behavior: FlyBehavior = CanFly()
        self.swim_behavior: SwimBehavior = CanSwim()

    def perform_fly(self) -> str:
        return self.fly_behavior.fly()

    def perform_swim(self) -> str:
        return self.swim_behavior.swim()

    def set_fly_behavior(self, behavior: FlyBehavior):
        """Change behavior at RUNTIME"""
        self.fly_behavior = behavior


class Penguin:
    """Penguin correctly cannot fly"""
    def __init__(self):
        self.fly_behavior: FlyBehavior = CannotFly()
        self.swim_behavior: SwimBehavior = CanSwim()

    def perform_fly(self) -> str:
        return self.fly_behavior.fly()

    def perform_swim(self) -> str:
        return self.swim_behavior.swim()


# Practical example: File Compressor
class CompressionStrategy(ABC):
    @abstractmethod
    def compress(self, data: str) -> str:
        pass

class ZipCompression(CompressionStrategy):
    def compress(self, data: str) -> str:
        return f"ZIP[{len(data)} bytes -> compressed]"

class GzipCompression(CompressionStrategy):
    def compress(self, data: str) -> str:
        return f"GZIP[{len(data)} bytes -> compressed]"

class FileCompressor:
    """Uses composition to switch strategies"""
    def __init__(self, strategy: CompressionStrategy):
        self._strategy = strategy

    def compress_file(self, filepath: str, data: str) -> str:
        result = self._strategy.compress(data)
        return f"File '{filepath}': {result}"


# Usage
duck = Duck()
print(duck.perform_fly())   # Flying with wings!
duck.set_fly_behavior(CannotFly())  # Change at runtime
print(duck.perform_fly())   # Cannot fly

penguin = Penguin()
print(penguin.perform_fly())  # Cannot fly
print(penguin.perform_swim()) # Swimming!

compressor = FileCompressor(ZipCompression())
print(compressor.compress_file("data.txt", "Hello World"))`,
    realWorldExample: 'A car HAS-A engine (composition) rather than IS-A engine (inheritance). This allows the engine to be replaced or upgraded without changing the car class. You can swap from a gasoline engine to an electric motor at the engine interface level.',
  },
  {
    id: 'design-patterns-intro',
    title: 'Introduction to Design Patterns',
    slug: 'design-patterns-intro',
    category: 'Patterns Foundation',
    description: 'Design patterns are reusable solutions to commonly occurring problems in software design. They are not finished designs that can be directly converted to code; rather they are templates or blueprints for solving common design problems.',
    keyPoints: [
      'Creational Patterns: deal with object creation (Singleton, Factory, Builder, etc.)',
      'Structural Patterns: deal with object composition (Adapter, Decorator, Facade, etc.)',
      'Behavioral Patterns: deal with object communication (Observer, Strategy, Command, etc.)',
      'Patterns provide a common vocabulary for developers',
      'Not a silver bullet: apply when the problem fits, not everywhere',
      'Gang of Four (GoF) book introduced 23 classic patterns in 1994',
    ],
    pythonCode: `"""
Design Pattern Categories Overview

CREATIONAL PATTERNS (object creation)
- Singleton: ensure one instance
- Factory Method: delegate creation to subclasses
- Abstract Factory: families of related objects
- Builder: step-by-step construction
- Prototype: clone existing objects

STRUCTURAL PATTERNS (object composition)
- Adapter: make incompatible interfaces compatible
- Bridge: separate abstraction from implementation
- Composite: tree structures for part-whole hierarchies
- Decorator: add behavior without subclassing
- Facade: simplified interface to complex system
- Flyweight: share state for efficiency
- Proxy: control access to objects

BEHAVIORAL PATTERNS (object communication)
- Chain of Responsibility: pass requests along a chain
- Command: encapsulate requests as objects
- Iterator: access elements sequentially
- Mediator: centralize object communications
- Memento: save and restore object state
- Observer: notify dependents of state changes
- State: alter behavior when state changes
- Strategy: family of interchangeable algorithms
- Template Method: skeleton algorithm in superclass
- Visitor: add operations without modifying objects
"""

# Quick example: How patterns work together
from abc import ABC, abstractmethod


class Logger(ABC):  # Abstraction (Structural)
    @abstractmethod
    def log(self, msg: str): pass


class ConsoleLogger(Logger):
    _instance = None  # Singleton (Creational)

    def __new__(cls):
        if not cls._instance:
            cls._instance = super().__new__(cls)
        return cls._instance

    def log(self, msg: str):
        print(f"[LOG] {msg}")


class TimestampLogger(Logger):  # Decorator (Structural)
    def __init__(self, logger: Logger):
        self._logger = logger

    def log(self, msg: str):
        from datetime import datetime
        self._logger.log(f"{datetime.now().isoformat()} - {msg}")


class EventSystem:  # Observer (Behavioral)
    def __init__(self, logger: Logger):
        self._logger = logger
        self._observers = []

    def subscribe(self, observer):
        self._observers.append(observer)

    def notify(self, event: str):
        self._logger.log(f"Event: {event}")
        for obs in self._observers:
            obs(event)


# Using all three patterns together
logger = TimestampLogger(ConsoleLogger())
events = EventSystem(logger)
events.subscribe(lambda e: print(f"Handler 1: {e}"))
events.subscribe(lambda e: print(f"Handler 2: {e}"))
events.notify("user_registered")`,
    realWorldExample: 'Django\'s ORM uses Template Method for query building, Observer for signals, Singleton for database connections, and Strategy for different database backends. Spring Framework uses Singleton for beans, Factory for dependency injection, Proxy for AOP, and Decorator for transaction management.',
  },
  {
    id: 'coupling-cohesion',
    title: 'Coupling & Cohesion',
    slug: 'coupling-cohesion',
    category: 'Design Principles',
    description: 'Coupling measures how dependent one module is on another. Cohesion measures how focused and related the responsibilities within a module are. Good design aims for LOW coupling and HIGH cohesion.',
    keyPoints: [
      'Low coupling: modules are independent, changes in one do not ripple to others',
      'High cohesion: a class has a single, well-defined purpose',
      'God classes: highly coupled and low cohesion (anti-pattern)',
      'Tight coupling: changes in one class break other classes',
      'Loose coupling: communicate through interfaces/abstractions',
      'Types of coupling: data, stamp, control, common, content (worst to best)',
    ],
    pythonCode: `# TIGHT COUPLING (bad)
class OrderTightly:
    def place_order(self, items: list, email: str, card_number: str):
        # All logic crammed together - hard to change/test/reuse
        total = sum(item['price'] for item in items)

        # Hardcoded database (tight coupling)
        import sqlite3
        conn = sqlite3.connect("orders.db")
        conn.execute("INSERT INTO orders VALUES (?)", (total,))

        # Hardcoded email service (tight coupling)
        import smtplib
        with smtplib.SMTP('smtp.gmail.com') as server:
            server.sendmail("shop@example.com", email, f"Total: \${total}")

        # Hardcoded payment (tight coupling)
        # Stripe.charge(card_number, total)  # Direct dependency!
        return True


# LOOSE COUPLING (good) - using interfaces
from abc import ABC, abstractmethod


class OrderRepository(ABC):
    @abstractmethod
    def save(self, order: dict) -> str:
        pass


class NotificationService(ABC):
    @abstractmethod
    def notify(self, recipient: str, message: str) -> bool:
        pass


class PaymentProcessor(ABC):
    @abstractmethod
    def charge(self, amount: float) -> bool:
        pass


# Concrete implementations (can be swapped easily)
class SQLOrderRepository(OrderRepository):
    def save(self, order: dict) -> str:
        print(f"Saving to SQL DB: {order}")
        return "ORD-001"


class EmailNotificationService(NotificationService):
    def notify(self, recipient: str, message: str) -> bool:
        print(f"Email to {recipient}: {message}")
        return True


class StripePaymentProcessor(PaymentProcessor):
    def charge(self, amount: float) -> bool:
        print(f"Charging {amount:.2f} via Stripe")
        return True


# High cohesion - OrderService ONLY handles order orchestration
class OrderService:
    def __init__(
        self,
        repo: OrderRepository,
        notifier: NotificationService,
        payment: PaymentProcessor
    ):
        self._repo = repo
        self._notifier = notifier
        self._payment = payment

    def place_order(self, items: list, customer_email: str) -> str:
        total = sum(item['price'] for item in items)

        if not self._payment.charge(total):
            raise Exception("Payment failed")

        order_id = self._repo.save({"items": items, "total": total})
        self._notifier.notify(customer_email, f"Order {order_id} confirmed! Total: \${total}")
        return order_id


# Easy to test (inject mocks), easy to change (swap implementations)
service = OrderService(
    SQLOrderRepository(),
    EmailNotificationService(),
    StripePaymentProcessor()
)

order_id = service.place_order(
    [{"name": "Laptop", "price": 999.99}],
    "customer@example.com"
)
print(f"Order placed: {order_id}")`,
    realWorldExample: 'A tightly coupled system is like hardwiring all electrical appliances. A loosely coupled system uses sockets and plugs - you can swap any appliance without rewiring. Microservices architecture achieves loose coupling by having services communicate through well-defined APIs.',
  },
];

export function getConceptBySlug(slug: string): OOPConcept | undefined {
  return oopConcepts.find((c) => c.slug === slug);
}
