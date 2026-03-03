export interface Pattern {
  id: string;
  name: string;
  slug: string;
  category: 'Creational' | 'Structural' | 'Behavioral';
  description: string;
  intent: string;
  useCases: string[];
  pros: string[];
  cons: string[];
  pythonCode: string;
}

export const patterns: Pattern[] = [
  // CREATIONAL PATTERNS
  {
    id: 'singleton',
    name: 'Singleton',
    slug: 'singleton',
    category: 'Creational',
    description: 'Ensures a class has only one instance and provides a global point of access to it.',
    intent: 'Ensure that a class has just a single instance, while providing a global access point to this instance.',
    useCases: [
      'Database connection pool',
      'Logger class',
      'Configuration manager',
      'Thread pool',
      'Cache manager',
    ],
    pros: [
      'Guarantees a class has only one instance',
      'Provides a global access point to that instance',
      'Singleton object is initialized only when requested for the first time',
      'Saves memory by reusing the same object',
    ],
    cons: [
      'Violates the Single Responsibility Principle',
      'Can mask bad design (global state)',
      'Requires special treatment in multithreaded environments',
      'Difficult to unit test due to global state',
    ],
    pythonCode: `import threading


class ThreadSafeSingleton:
    """Thread-safe Singleton using double-checked locking"""

    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                # Second check after acquiring lock
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
                    print("Singleton instance created")
        return cls._instance

    def get_message(self) -> str:
        return "Hello from Singleton!"


# Usage
s1 = ThreadSafeSingleton()
s2 = ThreadSafeSingleton()
print(s1 is s2)  # True - same instance
print(s1.get_message())


# Real-world example: Database Connection
class DatabaseConnection:
    _instance = None
    _lock = threading.Lock()

    def __new__(cls, host: str = "localhost", port: int = 5432):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
                    cls._instance.host = host
                    cls._instance.port = port
                    cls._instance.connection = None
                    print(f"New DB connection to {host}:{port}")
        return cls._instance

    def connect(self):
        if not self.connection:
            self.connection = f"Connected to {self.host}:{self.port}"
        return self.connection

    def query(self, sql: str):
        conn = self.connect()
        return f"Executing '{sql}' on {conn}"

db1 = DatabaseConnection("prod-db.example.com", 5432)
db2 = DatabaseConnection()  # Returns same instance
print(db1 is db2)  # True
print(db1.query("SELECT * FROM users"))`,
  },
  {
    id: 'factory',
    name: 'Factory Method',
    slug: 'factory',
    category: 'Creational',
    description: 'Defines an interface for creating an object, but lets subclasses decide which class to instantiate.',
    intent: 'Define an interface for creating an object, but let subclasses alter the type of objects that will be created.',
    useCases: [
      'Notification systems (Email, SMS, Push)',
      'Document creation (Word, PDF, Excel)',
      'UI elements for different platforms',
      'Payment gateway integrations',
      'Database driver selection',
    ],
    pros: [
      'Avoids tight coupling between creator and concrete products',
      'Single Responsibility Principle: move product creation to one place',
      'Open/Closed Principle: introduce new product types without breaking existing code',
      'Flexible and extensible object creation',
    ],
    cons: [
      'Code may become more complicated with many subclasses',
      'Client must subclass to change the type of product',
      'Can lead to a parallel class hierarchy',
    ],
    pythonCode: `from abc import ABC, abstractmethod


class Notification(ABC):
    """Abstract Product"""

    @abstractmethod
    def send(self, recipient: str, message: str) -> str:
        pass


class EmailNotification(Notification):
    def send(self, recipient: str, message: str) -> str:
        return f"Email to {recipient}: {message}"


class SMSNotification(Notification):
    def send(self, recipient: str, message: str) -> str:
        return f"SMS to {recipient}: {message}"


class PushNotification(Notification):
    def send(self, recipient: str, message: str) -> str:
        return f"Push notification to {recipient}: {message}"


class NotificationCreator(ABC):
    """Abstract Creator - Factory Method"""

    @abstractmethod
    def create_notification(self) -> Notification:
        """Factory method - subclasses implement this"""
        pass

    def notify(self, recipient: str, message: str) -> str:
        """Uses the factory method"""
        notification = self.create_notification()
        return notification.send(recipient, message)


class EmailNotificationCreator(NotificationCreator):
    def create_notification(self) -> Notification:
        return EmailNotification()


class SMSNotificationCreator(NotificationCreator):
    def create_notification(self) -> Notification:
        return SMSNotification()


# Simple Factory (alternative approach)
class SimpleNotificationFactory:
    @staticmethod
    def create_notification(notification_type: str) -> Notification:
        types = {
            "EMAIL": EmailNotification,
            "SMS": SMSNotification,
            "PUSH": PushNotification,
        }
        cls = types.get(notification_type.upper())
        if not cls:
            raise ValueError(f"Unknown type: {notification_type}")
        return cls()


# Usage
email_creator = EmailNotificationCreator()
result = email_creator.notify("user@example.com", "Hello!")
print(result)  # Email to user@example.com: Hello!

factory = SimpleNotificationFactory()
sms = factory.create_notification("SMS")
print(sms.send("+1234567890", "Verification code: 1234"))`,
  },
  {
    id: 'abstract-factory',
    name: 'Abstract Factory',
    slug: 'abstract-factory',
    category: 'Creational',
    description: 'Provides an interface for creating families of related or dependent objects without specifying their concrete classes.',
    intent: 'Produce families of related objects without specifying their concrete classes.',
    useCases: [
      'Cross-platform UI toolkits (Windows/Mac/Linux buttons)',
      'Database access layers (MySQL/PostgreSQL)',
      'Theme systems (Light/Dark themes)',
      'Shoe manufacturing with different styles',
      'Cloud provider abstraction (AWS/Azure/GCP)',
    ],
    pros: [
      'Products from a factory are compatible with each other',
      'Avoids tight coupling between concrete products and client code',
      'Single Responsibility Principle: product creation in one place',
      'Open/Closed Principle: introduce new product variants easily',
    ],
    cons: [
      'Code may become more complicated with many new interfaces and classes',
      'Hard to add support for new kinds of products',
      'Can be overkill for simple cases',
    ],
    pythonCode: `from abc import ABC, abstractmethod


# Abstract Products
class Button(ABC):
    @abstractmethod
    def render(self) -> str:
        pass

class Checkbox(ABC):
    @abstractmethod
    def render(self) -> str:
        pass


# Concrete Products - Windows
class WindowsButton(Button):
    def render(self) -> str:
        return "Rendering Windows Button"

class WindowsCheckbox(Checkbox):
    def render(self) -> str:
        return "Rendering Windows Checkbox"


# Concrete Products - Mac
class MacButton(Button):
    def render(self) -> str:
        return "Rendering Mac Button"

class MacCheckbox(Checkbox):
    def render(self) -> str:
        return "Rendering Mac Checkbox"


# Abstract Factory
class GUIFactory(ABC):
    @abstractmethod
    def create_button(self) -> Button:
        pass

    @abstractmethod
    def create_checkbox(self) -> Checkbox:
        pass


# Concrete Factories
class WindowsFactory(GUIFactory):
    def create_button(self) -> Button:
        return WindowsButton()

    def create_checkbox(self) -> Checkbox:
        return WindowsCheckbox()


class MacFactory(GUIFactory):
    def create_button(self) -> Button:
        return MacButton()

    def create_checkbox(self) -> Checkbox:
        return MacCheckbox()


# Client code
class Application:
    def __init__(self, factory: GUIFactory):
        self.button = factory.create_button()
        self.checkbox = factory.create_checkbox()

    def render(self):
        print(self.button.render())
        print(self.checkbox.render())


# Platform detection and factory selection
import sys
platform = "windows" if sys.platform == "win32" else "mac"
factory = WindowsFactory() if platform == "windows" else MacFactory()
app = Application(factory)
app.render()`,
  },
  {
    id: 'builder',
    name: 'Builder',
    slug: 'builder',
    category: 'Creational',
    description: 'Separates the construction of a complex object from its representation, allowing the same construction process to create different representations.',
    intent: 'Construct complex objects step by step. Allows producing different types and representations of an object using the same construction code.',
    useCases: [
      'Building complex HTTP requests',
      'Query builders for databases',
      'Building complex configuration objects',
      'Document builders (HTML, PDF)',
      'Meal/Order builders in restaurants',
    ],
    pros: [
      'Construct objects step-by-step, defer steps, or run steps recursively',
      'Reuse same construction code when building various representations',
      'Single Responsibility Principle: isolate complex construction code',
      'Fine control over the construction process',
    ],
    cons: [
      'Overall complexity increases as you need to create multiple new classes',
      'Must create a concrete builder for each type of product',
      'Can be overkill for simple objects',
    ],
    pythonCode: `from typing import Dict, Optional


class HttpRequest:
    """Immutable HttpRequest object created using Builder pattern"""

    def __init__(self, builder: 'HttpRequest.Builder'):
        self._url = builder._url
        self._method = builder._method
        self._headers = dict(builder._headers)
        self._query_params = dict(builder._query_params)
        self._body = builder._body
        self._timeout = builder._timeout

    @property
    def url(self) -> str:
        return self._url

    @property
    def method(self) -> str:
        return self._method

    def __str__(self) -> str:
        return (f"HttpRequest(url='{self._url}', method='{self._method}', "
                f"headers={self._headers}, body='{self._body}', "
                f"timeout={self._timeout}ms)")

    class Builder:
        def __init__(self, url: str):
            if not url or not url.strip():
                raise ValueError("URL cannot be empty")
            self._url = url
            self._method = "GET"
            self._headers: Dict[str, str] = {}
            self._query_params: Dict[str, str] = {}
            self._body: Optional[str] = None
            self._timeout = 30000

        def method(self, method: str) -> 'HttpRequest.Builder':
            self._method = method.upper()
            return self

        def header(self, key: str, value: str) -> 'HttpRequest.Builder':
            self._headers[key] = value
            return self

        def query_param(self, key: str, value: str) -> 'HttpRequest.Builder':
            self._query_params[key] = value
            return self

        def body(self, body: str) -> 'HttpRequest.Builder':
            self._body = body
            return self

        def timeout(self, timeout_millis: int) -> 'HttpRequest.Builder':
            if timeout_millis > 0:
                self._timeout = timeout_millis
            return self

        def build(self) -> 'HttpRequest':
            return HttpRequest(self)


# Usage - Fluent API
request = (HttpRequest.Builder("https://api.example.com/users")
    .method("POST")
    .header("Content-Type", "application/json")
    .header("Authorization", "Bearer token123")
    .query_param("version", "v2")
    .body('{"name": "John", "email": "john@example.com"}')
    .timeout(5000)
    .build())

print(request)`,
  },
  {
    id: 'prototype',
    name: 'Prototype',
    slug: 'prototype',
    category: 'Creational',
    description: 'Creates new objects by copying an existing object (prototype), allowing object creation without depending on their classes.',
    intent: 'Copy existing objects without making your code dependent on their classes.',
    useCases: [
      'Document cloning (copy of a document with different content)',
      'Game character creation with pre-configured templates',
      'Object creation is expensive (complex initialization)',
      'Creating objects that differ slightly from existing ones',
      'Historical snapshots of objects',
    ],
    pros: [
      'Clone objects without coupling to their concrete classes',
      'Get rid of repeated initialization code in favor of cloning',
      'Produce complex objects more conveniently',
      'Alternative to inheritance when dealing with configuration presets',
    ],
    cons: [
      'Cloning complex objects with circular references can be tricky',
      'Deep vs shallow copy confusion',
      'Each subclass must implement clone method',
    ],
    pythonCode: `import copy
from abc import ABC, abstractmethod


class Shape(ABC):
    def __init__(self, color: str):
        self.color = color

    @abstractmethod
    def clone(self) -> 'Shape':
        pass

    @abstractmethod
    def draw(self) -> str:
        pass


class Circle(Shape):
    def __init__(self, color: str, radius: float):
        super().__init__(color)
        self.radius = radius

    def clone(self) -> 'Circle':
        return copy.deepcopy(self)

    def draw(self) -> str:
        return f"Circle(color={self.color}, radius={self.radius})"


class Rectangle(Shape):
    def __init__(self, color: str, width: float, height: float):
        super().__init__(color)
        self.width = width
        self.height = height

    def clone(self) -> 'Rectangle':
        return copy.deepcopy(self)

    def draw(self) -> str:
        return f"Rectangle(color={self.color}, {self.width}x{self.height})"


# Prototype Registry
class ShapeRegistry:
    def __init__(self):
        self._prototypes: dict = {}

    def register(self, key: str, prototype: Shape):
        self._prototypes[key] = prototype

    def create(self, key: str) -> Shape:
        if key not in self._prototypes:
            raise ValueError(f"Prototype '{key}' not found")
        return self._prototypes[key].clone()


# Usage
registry = ShapeRegistry()
registry.register("small_red_circle", Circle("red", 5.0))
registry.register("large_blue_rect", Rectangle("blue", 100.0, 50.0))

# Clone instead of creating from scratch
c1 = registry.create("small_red_circle")
c2 = registry.create("small_red_circle")
c2.color = "green"  # Modify clone without affecting prototype

print(c1.draw())  # Circle(color=red, radius=5.0)
print(c2.draw())  # Circle(color=green, radius=5.0)
print(c1 is c2)   # False - different objects`,
  },

  // STRUCTURAL PATTERNS
  {
    id: 'adapter',
    name: 'Adapter',
    slug: 'adapter',
    category: 'Structural',
    description: 'Allows incompatible interfaces to work together by wrapping an object in an adapter to make it compatible with another class.',
    intent: 'Convert the interface of a class into another interface that clients expect. Adapter lets classes work together that could not otherwise because of incompatible interfaces.',
    useCases: [
      'Integrating legacy systems with new code',
      'Third-party library integration',
      'Payment gateway adapters',
      'Data format converters (XML to JSON)',
      'Old API to new API wrappers',
    ],
    pros: [
      'Single Responsibility Principle: separate interface/data conversion',
      'Open/Closed Principle: introduce new adapters without breaking existing code',
      'Makes incompatible interfaces work together',
    ],
    cons: [
      'Overall complexity increases with additional classes',
      'Sometimes it is simpler to change the service class to match the interface',
    ],
    pythonCode: `from abc import ABC, abstractmethod


# Target interface (what client expects)
class PaymentProcessor(ABC):
    @abstractmethod
    def process_payment(self, amount: float, currency: str) -> bool:
        pass


# Adaptee (existing/legacy class with incompatible interface)
class LegacyGateway:
    def make_payment(self, amount_cents: int, currency_code: str) -> int:
        """Returns status code: 0=success, 1=failure"""
        print(f"Legacy: Processing {amount_cents} cents in {currency_code}")
        return 0  # Success


# Adapter - makes LegacyGateway compatible with PaymentProcessor
class LegacyGatewayAdapter(PaymentProcessor):
    def __init__(self, legacy_gateway: LegacyGateway):
        self._legacy = legacy_gateway

    def process_payment(self, amount: float, currency: str) -> bool:
        # Convert from PaymentProcessor interface to LegacyGateway interface
        amount_cents = int(amount * 100)
        status_code = self._legacy.make_payment(amount_cents, currency.upper())
        return status_code == 0  # Convert status code to boolean


# Modern payment processor (no adapter needed)
class ModernPaymentProcessor(PaymentProcessor):
    def process_payment(self, amount: float, currency: str) -> bool:
        print(f"Modern: Processing {amount:.2f} {currency}")
        return True


# Client code works with PaymentProcessor interface
class CheckoutService:
    def __init__(self, processor: PaymentProcessor):
        self._processor = processor

    def checkout(self, amount: float, currency: str = "USD"):
        success = self._processor.process_payment(amount, currency)
        status = "succeeded" if success else "failed"
        print(f"Checkout {status} for {amount:.2f}")


# Usage - client doesn't care if it's legacy or modern
legacy = LegacyGateway()
adapter = LegacyGatewayAdapter(legacy)
service = CheckoutService(adapter)
service.checkout(29.99)

# Swap to modern processor without changing CheckoutService
modern = ModernPaymentProcessor()
service2 = CheckoutService(modern)
service2.checkout(49.99)`,
  },
  {
    id: 'bridge',
    name: 'Bridge',
    slug: 'bridge',
    category: 'Structural',
    description: 'Decouples an abstraction from its implementation so that the two can vary independently.',
    intent: 'Split a large class or a set of closely related classes into two separate hierarchies—abstraction and implementation—which can be developed independently of each other.',
    useCases: [
      'Cross-platform applications (different rendering engines)',
      'Device drivers for different platforms',
      'Shapes with different rendering backends (vector/raster)',
      'Logging systems with multiple backends',
    ],
    pros: [
      'Create platform-independent classes and apps',
      'Client code works with high-level abstractions',
      'Open/Closed Principle: new abstractions and implementations independently',
      'Single Responsibility Principle: separate abstraction and implementation concerns',
    ],
    cons: [
      'Code may become more complicated for highly cohesive classes',
      'Can be overkill for simple scenarios',
    ],
    pythonCode: `from abc import ABC, abstractmethod


# Implementation interface
class Renderer(ABC):
    @abstractmethod
    def render_circle(self, x: float, y: float, radius: float) -> str:
        pass

    @abstractmethod
    def render_rectangle(self, x: float, y: float, width: float, height: float) -> str:
        pass


# Concrete Implementations
class VectorRenderer(Renderer):
    def render_circle(self, x, y, radius) -> str:
        return f"Vector: Circle at ({x},{y}) r={radius}"

    def render_rectangle(self, x, y, width, height) -> str:
        return f"Vector: Rect at ({x},{y}) {width}x{height}"


class RasterRenderer(Renderer):
    def render_circle(self, x, y, radius) -> str:
        return f"Raster: Drawing {int(radius*2)}px circle at ({x},{y})"

    def render_rectangle(self, x, y, width, height) -> str:
        return f"Raster: Drawing {int(width)}x{int(height)}px rect at ({x},{y})"


# Abstraction
class Shape(ABC):
    def __init__(self, renderer: Renderer):
        self.renderer = renderer  # Bridge to implementation

    @abstractmethod
    def draw(self) -> str:
        pass

    @abstractmethod
    def resize(self, factor: float):
        pass


# Refined Abstractions
class Circle(Shape):
    def __init__(self, renderer: Renderer, x: float, y: float, radius: float):
        super().__init__(renderer)
        self.x, self.y, self.radius = x, y, radius

    def draw(self) -> str:
        return self.renderer.render_circle(self.x, self.y, self.radius)

    def resize(self, factor: float):
        self.radius *= factor


class Rectangle(Shape):
    def __init__(self, renderer: Renderer, x: float, y: float, w: float, h: float):
        super().__init__(renderer)
        self.x, self.y, self.w, self.h = x, y, w, h

    def draw(self) -> str:
        return self.renderer.render_rectangle(self.x, self.y, self.w, self.h)

    def resize(self, factor: float):
        self.w *= factor
        self.h *= factor


# Usage - mix and match abstraction with implementation
vector = VectorRenderer()
raster = RasterRenderer()

# Same shape, different renderers
c1 = Circle(vector, 0, 0, 50)
c2 = Circle(raster, 0, 0, 50)
print(c1.draw())  # Vector: Circle at (0,0) r=50
print(c2.draw())  # Raster: Drawing 100px circle at (0,0)

# Switch renderer at runtime
c1.renderer = raster
print(c1.draw())  # Now uses raster`,
  },
  {
    id: 'composite',
    name: 'Composite',
    slug: 'composite',
    category: 'Structural',
    description: 'Composes objects into tree structures to represent part-whole hierarchies, letting clients treat individual objects and compositions uniformly.',
    intent: 'Compose objects into tree structures to represent part-whole hierarchies. Composite lets clients treat individual objects and compositions of objects uniformly.',
    useCases: [
      'File system (files and directories)',
      'Organization hierarchy (employees and managers)',
      'UI component trees',
      'Menu systems with sub-menus',
      'Expression trees in compilers',
    ],
    pros: [
      'Work with complex tree structures conveniently using polymorphism and recursion',
      'Open/Closed Principle: introduce new element types without breaking existing code',
      'Clients treat simple and complex elements uniformly',
    ],
    cons: [
      'Hard to provide a common interface for classes with very different functionality',
      'May make the design overly general',
    ],
    pythonCode: `from abc import ABC, abstractmethod
from typing import List


class FileSystemItem(ABC):
    """Component interface"""

    def __init__(self, name: str):
        self.name = name

    @abstractmethod
    def get_size(self) -> int:
        pass

    @abstractmethod
    def display(self, indent: int = 0) -> str:
        pass


class File(FileSystemItem):
    """Leaf node"""

    def __init__(self, name: str, size: int):
        super().__init__(name)
        self.size = size

    def get_size(self) -> int:
        return self.size

    def display(self, indent: int = 0) -> str:
        return " " * indent + f"📄 {self.name} ({self.size} bytes)"


class Folder(FileSystemItem):
    """Composite node"""

    def __init__(self, name: str):
        super().__init__(name)
        self.children: List[FileSystemItem] = []

    def add(self, item: FileSystemItem):
        self.children.append(item)

    def remove(self, item: FileSystemItem):
        self.children.remove(item)

    def get_size(self) -> int:
        return sum(child.get_size() for child in self.children)

    def display(self, indent: int = 0) -> str:
        lines = [" " * indent + f"📁 {self.name}/"]
        for child in self.children:
            lines.append(child.display(indent + 2))
        return "\\n".join(lines)


# Usage - client treats files and folders uniformly
root = Folder("root")
src = Folder("src")
tests = Folder("tests")

src.add(File("main.py", 1024))
src.add(File("utils.py", 512))
tests.add(File("test_main.py", 768))

root.add(src)
root.add(tests)
root.add(File("README.md", 2048))

print(root.display())
print(f"\\nTotal size: {root.get_size()} bytes")`,
  },
  {
    id: 'decorator',
    name: 'Decorator',
    slug: 'decorator',
    category: 'Structural',
    description: 'Attaches additional responsibilities to an object dynamically. Decorators provide a flexible alternative to subclassing for extending functionality.',
    intent: 'Attach new behaviors to objects by placing them inside special wrapper objects that contain the behaviors.',
    useCases: [
      'Text formatting (bold, italic, underline)',
      'Middleware in web frameworks',
      'I/O streams with additional functionality',
      'Caching layers',
      'Logging wrappers around services',
    ],
    pros: [
      'Extend object behavior without making a new subclass',
      'Add or remove responsibilities at runtime',
      'Combine behaviors by wrapping in multiple decorators',
      'Single Responsibility Principle: divide monolithic class into several smaller classes',
    ],
    cons: [
      'Hard to remove a specific wrapper from the stack',
      'Hard to implement a decorator whose behavior does not depend on order',
      'Initial configuration code may look messy',
    ],
    pythonCode: `from abc import ABC, abstractmethod


class TextView(ABC):
    """Component interface"""
    @abstractmethod
    def render(self) -> str:
        pass


class PlainTextView(TextView):
    """Concrete component"""
    def __init__(self, text: str):
        self.text = text

    def render(self) -> str:
        return self.text


class TextDecorator(TextView, ABC):
    """Base decorator"""
    def __init__(self, wrapped: TextView):
        self._wrapped = wrapped

    def render(self) -> str:
        return self._wrapped.render()


class BoldDecorator(TextDecorator):
    def render(self) -> str:
        return f"<b>{super().render()}</b>"


class ItalicDecorator(TextDecorator):
    def render(self) -> str:
        return f"<i>{super().render()}</i>"


class UnderlineDecorator(TextDecorator):
    def render(self) -> str:
        return f"<u>{super().render()}</u>"


class ColorDecorator(TextDecorator):
    def __init__(self, wrapped: TextView, color: str):
        super().__init__(wrapped)
        self.color = color

    def render(self) -> str:
        return f'<span style="color:{self.color}">{super().render()}</span>'


# Usage - stack decorators dynamically
text = PlainTextView("Hello, World!")
bold_text = BoldDecorator(text)
bold_italic = ItalicDecorator(bold_text)
full_style = UnderlineDecorator(ColorDecorator(bold_italic, "blue"))

print(text.render())        # Hello, World!
print(bold_text.render())   # <b>Hello, World!</b>
print(bold_italic.render()) # <i><b>Hello, World!</b></i>
print(full_style.render())  # <u><span style="color:blue">...</span></u>`,
  },
  {
    id: 'facade',
    name: 'Facade',
    slug: 'facade',
    category: 'Structural',
    description: 'Provides a simplified interface to a complex subsystem, hiding its complexity from clients.',
    intent: 'Provide a simplified interface to a library, a framework, or any other complex set of classes.',
    useCases: [
      'Deployment system hiding build/test/deploy complexity',
      'Database connection management',
      'Complex library wrappers',
      'Home theater system controls',
      'API gateway pattern',
    ],
    pros: [
      'Isolate your code from the complexity of a subsystem',
      'Provides simple interface to complex subsystem',
      'Reduces coupling between client and subsystem',
    ],
    cons: [
      'Facade can become a god object coupled to all classes of an app',
      'May hide useful functionality',
    ],
    pythonCode: `# Complex subsystems
class BuildSystem:
    def compile(self) -> str:
        return "Compiling source code..."

    def run_tests(self) -> str:
        return "Running unit tests... All passed!"

    def package(self) -> str:
        return "Packaging application..."


class VersionControlSystem:
    def checkout(self, branch: str) -> str:
        return f"Checking out branch: {branch}"

    def tag(self, version: str) -> str:
        return f"Creating tag: v{version}"


class DeploymentTarget:
    def upload(self, artifact: str) -> str:
        return f"Uploading {artifact} to server..."

    def restart_service(self) -> str:
        return "Restarting service... Done!"

    def health_check(self) -> str:
        return "Health check: OK"


# Facade - simple interface hiding complexity
class DeploymentFacade:
    def __init__(self):
        self._build = BuildSystem()
        self._vcs = VersionControlSystem()
        self._target = DeploymentTarget()

    def deploy(self, branch: str, version: str) -> None:
        """Single method hiding all deployment complexity"""
        steps = [
            self._vcs.checkout(branch),
            self._build.compile(),
            self._build.run_tests(),
            self._build.package(),
            self._vcs.tag(version),
            self._target.upload(f"app-{version}.jar"),
            self._target.restart_service(),
            self._target.health_check(),
        ]
        for step in steps:
            print(f"  ✓ {step}")
        print(f"Deployment v{version} complete!")


# Client uses simple facade interface
deployer = DeploymentFacade()
deployer.deploy("main", "2.1.0")`,
  },
  {
    id: 'flyweight',
    name: 'Flyweight',
    slug: 'flyweight',
    category: 'Structural',
    description: 'Reduces memory usage by sharing common state among many fine-grained objects.',
    intent: 'Fit more objects into the available amount of RAM by sharing common parts of state between multiple objects, instead of keeping all of the data in each object.',
    useCases: [
      'Character glyphs in text editors',
      'Particles in games (bullets, effects)',
      'Icons in file explorers',
      'Tree rendering in forests/maps',
      'Connection pools',
    ],
    pros: [
      'Save lots of RAM by sharing data between similar objects',
      'Reduces object creation overhead',
      'Efficient for large numbers of similar objects',
    ],
    cons: [
      'Trade RAM for CPU cycles (recalculate context data each time)',
      'Code becomes more complicated',
      'Hard to determine flyweight state vs intrinsic state',
    ],
    pythonCode: `from typing import Dict


# Flyweight - shared intrinsic state
class CharacterFlyweight:
    def __init__(self, char: str, font: str, size: int):
        # Intrinsic state (shared, immutable)
        self.char = char
        self.font = font
        self.size = size

    def render(self, x: int, y: int, color: str) -> str:
        # Extrinsic state (position, color) passed in
        return f"'{self.char}' ({self.font},{self.size}pt,{color}) at ({x},{y})"


# Flyweight Factory
class CharacterFlyweightFactory:
    _flyweights: Dict[str, CharacterFlyweight] = {}

    @classmethod
    def get_flyweight(cls, char: str, font: str, size: int) -> CharacterFlyweight:
        key = f"{char}_{font}_{size}"
        if key not in cls._flyweights:
            cls._flyweights[key] = CharacterFlyweight(char, font, size)
            print(f"Creating new flyweight for '{char}'")
        return cls._flyweights[key]

    @classmethod
    def count(cls) -> int:
        return len(cls._flyweights)


# Context - stores extrinsic state
class CharacterGlyph:
    def __init__(self, char: str, font: str, size: int, x: int, y: int, color: str):
        # Get shared flyweight (intrinsic state)
        self.flyweight = CharacterFlyweightFactory.get_flyweight(char, font, size)
        # Store extrinsic state
        self.x = x
        self.y = y
        self.color = color

    def render(self) -> str:
        return self.flyweight.render(self.x, self.y, self.color)


# Usage - 1000 characters but only unique flyweights created
text = "Hello World Hello World"
glyphs = []
for i, char in enumerate(text):
    glyph = CharacterGlyph(char, "Arial", 12, i * 10, 0, "black")
    glyphs.append(glyph)

print(f"Characters: {len(glyphs)}")
print(f"Unique flyweights: {CharacterFlyweightFactory.count()}")
print(glyphs[0].render())`,
  },
  {
    id: 'proxy',
    name: 'Proxy',
    slug: 'proxy',
    category: 'Structural',
    description: 'Provides a surrogate or placeholder for another object to control access to it.',
    intent: 'Provide a substitute or placeholder for another object. A proxy controls access to the original object, allowing you to perform something before or after the request.',
    useCases: [
      'Lazy initialization (virtual proxy)',
      'Access control (protection proxy)',
      'Logging and monitoring (logging proxy)',
      'Caching (caching proxy)',
      'Remote object access (remote proxy)',
    ],
    pros: [
      'Control service object without clients knowing',
      'Manage lifecycle of service object when clients do not care',
      'Works even if service object is not ready or available',
      'Open/Closed Principle: introduce new proxies without changing service or clients',
    ],
    cons: [
      'Response delay due to extra processing',
      'Code may become complicated',
      'Boilerplate code for delegation',
    ],
    pythonCode: `from abc import ABC, abstractmethod
from typing import Dict, Optional
import time


class DataService(ABC):
    @abstractmethod
    def fetch_data(self, query: str) -> dict:
        pass


class RealDataService(DataService):
    """Actual expensive service"""
    def fetch_data(self, query: str) -> dict:
        print(f"Fetching data for: {query} (slow DB call...)")
        time.sleep(0.1)  # Simulate slow DB
        return {"query": query, "result": f"data for {query}"}


# Caching Proxy
class CachedDataService(DataService):
    def __init__(self, real_service: DataService):
        self._real = real_service
        self._cache: Dict[str, dict] = {}

    def fetch_data(self, query: str) -> dict:
        if query in self._cache:
            print(f"Cache hit for: {query}")
            return self._cache[query]

        print(f"Cache miss for: {query}")
        result = self._real.fetch_data(query)
        self._cache[query] = result
        return result


# Logging Proxy
class LoggingDataService(DataService):
    def __init__(self, service: DataService):
        self._service = service
        self._calls = 0

    def fetch_data(self, query: str) -> dict:
        self._calls += 1
        print(f"[LOG] Call #{self._calls}: fetch_data('{query}')")
        start = time.time()
        result = self._service.fetch_data(query)
        elapsed = (time.time() - start) * 1000
        print(f"[LOG] Completed in {elapsed:.1f}ms")
        return result


# Usage - chain proxies
real = RealDataService()
cached = CachedDataService(real)
logged = LoggingDataService(cached)

logged.fetch_data("SELECT * FROM users")  # Cache miss
logged.fetch_data("SELECT * FROM users")  # Cache hit
logged.fetch_data("SELECT * FROM orders") # Cache miss`,
  },

  // BEHAVIORAL PATTERNS
  {
    id: 'observer',
    name: 'Observer',
    slug: 'observer',
    category: 'Behavioral',
    description: 'Defines a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.',
    intent: 'Define a subscription mechanism to notify multiple objects about any events that happen to the object they are observing.',
    useCases: [
      'Event handling systems',
      'GUI components with model updates',
      'Publish-subscribe systems',
      'Real-time data feeds (stock prices)',
      'Notification systems',
    ],
    pros: [
      'Open/Closed Principle: introduce new subscriber classes without changing publisher',
      'Establish relations between objects at runtime',
      'Decouples subjects from observers',
    ],
    cons: [
      'Subscribers are notified in random order',
      'Memory leaks if observers not properly removed',
      'Unexpected updates if not carefully designed',
    ],
    pythonCode: `from abc import ABC, abstractmethod
from typing import List


class FitnessDataObserver(ABC):
    """Observer interface"""
    @abstractmethod
    def on_data_update(self, steps: int, calories: float, distance: float):
        pass


class FitnessData:
    """Subject - maintains state and notifies observers"""

    def __init__(self):
        self._observers: List[FitnessDataObserver] = []
        self._steps = 0
        self._calories = 0.0
        self._distance = 0.0

    def register(self, observer: FitnessDataObserver):
        self._observers.append(observer)

    def unregister(self, observer: FitnessDataObserver):
        self._observers.remove(observer)

    def _notify_all(self):
        for observer in self._observers:
            observer.on_data_update(self._steps, self._calories, self._distance)

    def update_stats(self, steps: int, calories: float, distance: float):
        self._steps = steps
        self._calories = calories
        self._distance = distance
        self._notify_all()  # Automatically notify all observers


class LiveActivityDisplay(FitnessDataObserver):
    def on_data_update(self, steps: int, calories: float, distance: float):
        print(f"[Display] Steps: {steps} | Calories: {calories:.1f} | Distance: {distance:.2f}km")


class GoalNotifier(FitnessDataObserver):
    def __init__(self, step_goal: int):
        self.step_goal = step_goal

    def on_data_update(self, steps: int, calories: float, distance: float):
        if steps >= self.step_goal:
            print(f"[Goal] Congratulations! You reached {steps}/{self.step_goal} steps!")


class ProgressLogger(FitnessDataObserver):
    def on_data_update(self, steps: int, calories: float, distance: float):
        print(f"[Log] Activity recorded: {steps} steps, {calories:.1f} cal, {distance:.2f}km")


# Usage
fitness = FitnessData()
display = LiveActivityDisplay()
goal = GoalNotifier(10000)
logger = ProgressLogger()

fitness.register(display)
fitness.register(goal)
fitness.register(logger)

fitness.update_stats(5000, 250.5, 3.5)
print("---")
fitness.update_stats(10500, 525.0, 7.3)`,
  },
  {
    id: 'strategy',
    name: 'Strategy',
    slug: 'strategy',
    category: 'Behavioral',
    description: 'Defines a family of algorithms, encapsulates each one, and makes them interchangeable. Strategy lets the algorithm vary independently from clients that use it.',
    intent: 'Define a family of algorithms, put each of them into a separate class, and make their objects interchangeable.',
    useCases: [
      'Sorting algorithms (quick sort, merge sort)',
      'Payment processing strategies',
      'Shipping cost calculation',
      'Compression algorithms',
      'Navigation routing algorithms',
    ],
    pros: [
      'Swap algorithms used inside an object at runtime',
      'Isolate implementation details from the code that uses it',
      'Replace inheritance with composition',
      'Open/Closed Principle: introduce new strategies without changing context',
    ],
    cons: [
      'Clients must be aware of differences between strategies',
      'Many modern languages have functional support (lambdas) that can replace simple strategies',
      'Overhead of strategy selection',
    ],
    pythonCode: `from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import List


@dataclass
class Order:
    items: List[str]
    weight: float  # kg
    total_value: float  # USD
    destination: str


class ShippingStrategy(ABC):
    """Strategy interface"""
    @abstractmethod
    def calculate_cost(self, order: Order) -> float:
        pass

    @abstractmethod
    def name(self) -> str:
        pass


class FlatRateShipping(ShippingStrategy):
    def __init__(self, rate: float = 5.99):
        self.rate = rate

    def calculate_cost(self, order: Order) -> float:
        return self.rate

    def name(self) -> str:
        return "Flat Rate"


class WeightBasedShipping(ShippingStrategy):
    def __init__(self, rate_per_kg: float = 2.5):
        self.rate_per_kg = rate_per_kg

    def calculate_cost(self, order: Order) -> float:
        return order.weight * self.rate_per_kg

    def name(self) -> str:
        return "Weight Based"


class FreeShipping(ShippingStrategy):
    def __init__(self, min_order_value: float = 50.0):
        self.min_value = min_order_value

    def calculate_cost(self, order: Order) -> float:
        if order.total_value >= self.min_value:
            return 0.0
        return 9.99  # Fallback if below minimum

    def name(self) -> str:
        return "Free Shipping (if eligible)"


class ShippingCostService:
    """Context class"""
    def __init__(self, strategy: ShippingStrategy):
        self._strategy = strategy

    def set_strategy(self, strategy: ShippingStrategy):
        """Switch strategy at runtime"""
        self._strategy = strategy

    def calculate_shipping_cost(self, order: Order) -> float:
        cost = self._strategy.calculate_cost(order)
        print(f"{self._strategy.name()}: {cost:.2f}")
        return cost


# Usage
order = Order(["laptop", "mouse"], weight=2.5, total_value=799.99, destination="NYC")
service = ShippingCostService(FlatRateShipping())
service.calculate_shipping_cost(order)  # Flat Rate: $5.99

service.set_strategy(WeightBasedShipping())
service.calculate_shipping_cost(order)  # Weight Based: $6.25

service.set_strategy(FreeShipping(min_order_value=500))
service.calculate_shipping_cost(order)  # Free Shipping: $0.00`,
  },
  {
    id: 'command',
    name: 'Command',
    slug: 'command',
    category: 'Behavioral',
    description: 'Encapsulates a request as an object, thereby allowing parameterization, queuing, logging, and undoable operations.',
    intent: 'Turn a request into a stand-alone object that contains all information about the request.',
    useCases: [
      'Undo/redo functionality in text editors',
      'Transaction management in databases',
      'Task scheduling and queuing',
      'Remote control systems',
      'Macro recording',
    ],
    pros: [
      'Single Responsibility Principle: decouple invoker from performer',
      'Open/Closed Principle: introduce new commands without breaking code',
      'Implement undo/redo',
      'Implement deferred execution of operations',
      'Assemble complex commands from simple ones',
    ],
    cons: [
      'Code may become more complicated with many command classes',
      'Higher number of classes for each command',
    ],
    pythonCode: `from abc import ABC, abstractmethod
from typing import List


class Command(ABC):
    @abstractmethod
    def execute(self) -> str:
        pass

    @abstractmethod
    def undo(self) -> str:
        pass


class Light:
    def __init__(self, name: str):
        self.name = name
        self.on = False
        self.brightness = 100

    def turn_on(self):
        self.on = True
        return f"{self.name} is ON"

    def turn_off(self):
        self.on = False
        return f"{self.name} is OFF"

    def dim(self, level: int):
        self.brightness = level
        return f"{self.name} dimmed to {level}%"


class LightOnCommand(Command):
    def __init__(self, light: Light):
        self.light = light

    def execute(self) -> str:
        return self.light.turn_on()

    def undo(self) -> str:
        return self.light.turn_off()


class LightOffCommand(Command):
    def __init__(self, light: Light):
        self.light = light

    def execute(self) -> str:
        return self.light.turn_off()

    def undo(self) -> str:
        return self.light.turn_on()


class RemoteControl:
    """Invoker - stores and executes commands"""
    def __init__(self):
        self._history: List[Command] = []

    def execute(self, command: Command):
        result = command.execute()
        self._history.append(command)
        print(f"Executed: {result}")

    def undo_last(self):
        if self._history:
            command = self._history.pop()
            result = command.undo()
            print(f"Undone: {result}")


# Macro command (composite)
class MacroCommand(Command):
    def __init__(self, commands: List[Command]):
        self.commands = commands

    def execute(self) -> str:
        results = [cmd.execute() for cmd in self.commands]
        return " | ".join(results)

    def undo(self) -> str:
        results = [cmd.undo() for cmd in reversed(self.commands)]
        return " | ".join(results)


# Usage
living_room = Light("Living Room")
kitchen = Light("Kitchen")
remote = RemoteControl()

remote.execute(LightOnCommand(living_room))
remote.execute(LightOnCommand(kitchen))
remote.undo_last()  # Undo kitchen light

# Macro - turn on all lights at once
all_on = MacroCommand([LightOnCommand(living_room), LightOnCommand(kitchen)])
remote.execute(all_on)`,
  },
  {
    id: 'state',
    name: 'State',
    slug: 'state',
    category: 'Behavioral',
    description: 'Allows an object to alter its behavior when its internal state changes. The object will appear to change its class.',
    intent: "Let an object alter its behavior when its internal state changes. It appears as if the object changed its class.",
    useCases: [
      'Vending machine states (idle, has money, dispensing)',
      'Order processing states (pending, processing, shipped)',
      'Traffic light states',
      'Document workflow (draft, review, published)',
      'Game character states (idle, running, jumping)',
    ],
    pros: [
      'Single Responsibility Principle: organize code for particular states into separate classes',
      'Open/Closed Principle: introduce new states without changing existing states or context',
      'Simplify the code of the context by eliminating bulky state machine conditionals',
    ],
    cons: [
      'Can be overkill if state machine has only a few states or rarely changes',
      'Introduces many classes for complex state machines',
    ],
    pythonCode: `from abc import ABC, abstractmethod


class OrderState(ABC):
    @abstractmethod
    def process(self, order: 'Order') -> str:
        pass

    @abstractmethod
    def cancel(self, order: 'Order') -> str:
        pass

    @abstractmethod
    def ship(self, order: 'Order') -> str:
        pass


class PendingState(OrderState):
    def process(self, order: 'Order') -> str:
        order.state = ProcessingState()
        return "Order is now being processed"

    def cancel(self, order: 'Order') -> str:
        order.state = CancelledState()
        return "Order cancelled"

    def ship(self, order: 'Order') -> str:
        return "Cannot ship - order is still pending!"


class ProcessingState(OrderState):
    def process(self, order: 'Order') -> str:
        return "Order is already being processed"

    def cancel(self, order: 'Order') -> str:
        order.state = CancelledState()
        return "Order cancelled (was processing)"

    def ship(self, order: 'Order') -> str:
        order.state = ShippedState()
        return "Order has been shipped!"


class ShippedState(OrderState):
    def process(self, order: 'Order') -> str:
        return "Order already shipped"

    def cancel(self, order: 'Order') -> str:
        return "Cannot cancel - order already shipped!"

    def ship(self, order: 'Order') -> str:
        return "Order already shipped"


class CancelledState(OrderState):
    def process(self, order: 'Order') -> str:
        return "Cannot process cancelled order"

    def cancel(self, order: 'Order') -> str:
        return "Order already cancelled"

    def ship(self, order: 'Order') -> str:
        return "Cannot ship cancelled order"


class Order:
    def __init__(self, order_id: str):
        self.order_id = order_id
        self.state: OrderState = PendingState()

    def process(self) -> str:
        return self.state.process(self)

    def cancel(self) -> str:
        return self.state.cancel(self)

    def ship(self) -> str:
        return self.state.ship(self)

    def status(self) -> str:
        return type(self.state).__name__.replace("State", "")


# Usage
order = Order("ORD-001")
print(f"Status: {order.status()}")     # Pending
print(order.ship())                     # Cannot ship - pending!
print(order.process())                  # Processing
print(order.ship())                     # Shipped!
print(order.cancel())                   # Cannot cancel - shipped!`,
  },
  {
    id: 'template-method',
    name: 'Template Method',
    slug: 'template-method',
    category: 'Behavioral',
    description: 'Defines the skeleton of an algorithm in the superclass, deferring some steps to subclasses without changing the overall algorithm structure.',
    intent: 'Define the skeleton of an algorithm in the superclass but let subclasses override specific steps of the algorithm without changing its structure.',
    useCases: [
      'Data mining with different data sources',
      'Report generation with different formats',
      'Game AI with specific behavior overrides',
      'Test frameworks with setup/teardown',
      'HTTP request processing pipelines',
    ],
    pros: [
      'Let clients override only certain parts of a large algorithm',
      'Pull duplicate code into a superclass',
      'Defines algorithm skeleton invariant parts clearly',
    ],
    cons: [
      'Template methods tend to be harder to maintain',
      'Might violate Liskov Substitution Principle by suppressing default step implementations',
      'Limits clients to overriding only specific parts',
    ],
    pythonCode: `from abc import ABC, abstractmethod
from typing import List


class DataProcessor(ABC):
    """Abstract class defining template method"""

    def process(self, data_source: str) -> List[dict]:
        """Template method - defines the algorithm skeleton"""
        raw_data = self.read_data(data_source)
        parsed_data = self.parse_data(raw_data)
        validated_data = self.validate_data(parsed_data)
        return self.transform_data(validated_data)

    @abstractmethod
    def read_data(self, source: str) -> str:
        """Subclasses must implement data reading"""
        pass

    @abstractmethod
    def parse_data(self, raw: str) -> List[dict]:
        """Subclasses must implement parsing"""
        pass

    def validate_data(self, data: List[dict]) -> List[dict]:
        """Default validation - can be overridden"""
        return [item for item in data if item]

    def transform_data(self, data: List[dict]) -> List[dict]:
        """Hook - optional override"""
        return data


class CSVProcessor(DataProcessor):
    def read_data(self, source: str) -> str:
        print(f"Reading CSV from: {source}")
        return "name,age\\nAlice,30\\nBob,25"

    def parse_data(self, raw: str) -> List[dict]:
        lines = raw.strip().split("\\n")
        headers = lines[0].split(",")
        return [dict(zip(headers, row.split(","))) for row in lines[1:]]


class JSONProcessor(DataProcessor):
    def read_data(self, source: str) -> str:
        print(f"Reading JSON from: {source}")
        return '[{"name":"Alice","age":"30"},{"name":"Bob","age":"25"}]'

    def parse_data(self, raw: str) -> List[dict]:
        import json
        return json.loads(raw)

    def transform_data(self, data: List[dict]) -> List[dict]:
        """Override to convert age to int"""
        for item in data:
            item["age"] = int(item["age"])
        return data


# Usage
csv_proc = CSVProcessor()
result = csv_proc.process("data.csv")
print(f"CSV Result: {result}")

json_proc = JSONProcessor()
result = json_proc.process("data.json")
print(f"JSON Result: {result}")`,
  },
  {
    id: 'iterator',
    name: 'Iterator',
    slug: 'iterator',
    category: 'Behavioral',
    description: 'Provides a way to sequentially access the elements of an aggregate object without exposing its underlying representation.',
    intent: 'Traverse elements of a collection without exposing its underlying representation (list, stack, tree, etc.).',
    useCases: [
      'Traversing different tree structures',
      'Pagination in APIs',
      'Lazy loading of data',
      'Custom collection traversal',
      'Database cursor',
    ],
    pros: [
      'Single Responsibility Principle: clean traversal algorithms',
      'Open/Closed Principle: implement new collection types and iterators without breaking',
      'Iterate same collection in parallel with separate iterators',
      'Delay and continue iteration',
    ],
    cons: [
      'Overkill for simple collections',
      'Less efficient than direct traversal for specialized collections',
    ],
    pythonCode: `from typing import Iterator, List, TypeVar, Generic

T = TypeVar('T')


class TreeNode:
    def __init__(self, value: int):
        self.value = value
        self.left = None
        self.right = None


class BinaryTree:
    def __init__(self, root: TreeNode):
        self.root = root

    def inorder(self) -> Iterator[int]:
        """In-order traversal iterator"""
        def traverse(node):
            if node:
                yield from traverse(node.left)
                yield node.value
                yield from traverse(node.right)
        return traverse(self.root)

    def preorder(self) -> Iterator[int]:
        """Pre-order traversal iterator"""
        def traverse(node):
            if node:
                yield node.value
                yield from traverse(node.left)
                yield from traverse(node.right)
        return traverse(self.root)

    def level_order(self) -> Iterator[int]:
        """BFS level-order traversal"""
        from collections import deque
        if not self.root:
            return
        queue = deque([self.root])
        while queue:
            node = queue.popleft()
            yield node.value
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)


# Build tree:     4
#               /   \\
#              2     6
#             / \\   / \\
#            1   3 5   7
root = TreeNode(4)
root.left = TreeNode(2)
root.right = TreeNode(6)
root.left.left = TreeNode(1)
root.left.right = TreeNode(3)
root.right.left = TreeNode(5)
root.right.right = TreeNode(7)

tree = BinaryTree(root)
print("In-order:", list(tree.inorder()))     # [1,2,3,4,5,6,7]
print("Pre-order:", list(tree.preorder()))   # [4,2,1,3,6,5,7]
print("Level-order:", list(tree.level_order()))  # [4,2,6,1,3,5,7]`,
  },
  {
    id: 'mediator',
    name: 'Mediator',
    slug: 'mediator',
    category: 'Behavioral',
    description: 'Reduces chaotic dependencies between objects by restricting direct communications between objects and forcing them to collaborate only through a mediator object.',
    intent: 'Reduce dependencies between objects by making them communicate indirectly through a mediator.',
    useCases: [
      'Chat room (users communicate through server)',
      'Air traffic control system',
      'Event bus/message broker',
      'GUI dialog coordination',
      'Microservice communication via API gateway',
    ],
    pros: [
      'Single Responsibility Principle: extract communications into one place',
      'Open/Closed Principle: introduce new mediators without changing components',
      'Reduce coupling between various components',
      'Reuse individual components more easily',
    ],
    cons: [
      'Mediator can become a God Object',
      'All complexity moves to mediator',
    ],
    pythonCode: `from abc import ABC, abstractmethod
from typing import List


class ChatMediator(ABC):
    @abstractmethod
    def send_message(self, message: str, sender: 'User', recipient: str = None):
        pass

    @abstractmethod
    def add_user(self, user: 'User'):
        pass


class ChatRoom(ChatMediator):
    def __init__(self, name: str):
        self.name = name
        self._users: dict = {}

    def add_user(self, user: 'User'):
        self._users[user.username] = user
        print(f"[{self.name}] {user.username} joined the chat")

    def send_message(self, message: str, sender: 'User', recipient: str = None):
        if recipient:
            # Direct message
            if recipient in self._users:
                self._users[recipient].receive(f"[DM from {sender.username}] {message}")
            else:
                sender.receive(f"User '{recipient}' not found")
        else:
            # Broadcast to all except sender
            for username, user in self._users.items():
                if username != sender.username:
                    user.receive(f"[{self.name}] {sender.username}: {message}")


class User:
    def __init__(self, username: str, mediator: ChatMediator):
        self.username = username
        self._mediator = mediator
        mediator.add_user(self)

    def send(self, message: str, to: str = None):
        self._mediator.send_message(message, self, to)

    def receive(self, message: str):
        print(f"  → {self.username} received: {message}")


# Usage
chat = ChatRoom("Python Devs")
alice = User("Alice", chat)
bob = User("Bob", chat)
charlie = User("Charlie", chat)

alice.send("Hey everyone!")
bob.send("Hi Alice!", to="Alice")  # Direct message
charlie.send("Hello world!")`,
  },
  {
    id: 'memento',
    name: 'Memento',
    slug: 'memento',
    category: 'Behavioral',
    description: 'Captures and externalizes an object\'s internal state without violating encapsulation, so the object can be restored to this state later.',
    intent: 'Save and restore the previous state of an object without revealing the details of its implementation.',
    useCases: [
      'Undo/redo in text editors',
      'Transaction rollback in databases',
      'Game save states',
      'Browser history',
      'Configuration snapshots',
    ],
    pros: [
      'Produce snapshots without violating encapsulation',
      'Simplify originator code by letting caretaker maintain history',
      'Restore object state without knowing implementation details',
    ],
    cons: [
      'High RAM consumption if clients create mementos too often',
      'Dynamic languages may not guarantee private state',
      'Caretakers must track originator lifecycle',
    ],
    pythonCode: `from typing import List, Optional
from dataclasses import dataclass
from copy import deepcopy


@dataclass
class EditorState:
    """Memento - stores editor state"""
    content: str
    cursor_pos: int
    selection: Optional[tuple] = None


class TextEditor:
    """Originator"""
    def __init__(self):
        self._content = ""
        self._cursor_pos = 0
        self._selection = None

    def type(self, text: str):
        self._content = (self._content[:self._cursor_pos] +
                         text +
                         self._content[self._cursor_pos:])
        self._cursor_pos += len(text)

    def delete(self, count: int = 1):
        start = max(0, self._cursor_pos - count)
        self._content = self._content[:start] + self._content[self._cursor_pos:]
        self._cursor_pos = start

    def save(self) -> EditorState:
        """Create memento snapshot"""
        return EditorState(self._content, self._cursor_pos, self._selection)

    def restore(self, state: EditorState):
        """Restore from memento"""
        self._content = state.content
        self._cursor_pos = state.cursor_pos
        self._selection = state.selection

    @property
    def content(self) -> str:
        return self._content


class EditorHistory:
    """Caretaker - manages mementos"""
    def __init__(self, editor: TextEditor):
        self._editor = editor
        self._history: List[EditorState] = []

    def save(self):
        self._history.append(self._editor.save())

    def undo(self):
        if self._history:
            state = self._history.pop()
            self._editor.restore(state)
            print(f"Undone. Content: '{self._editor.content}'")
        else:
            print("Nothing to undo!")


# Usage
editor = TextEditor()
history = EditorHistory(editor)

history.save()
editor.type("Hello")
history.save()
editor.type(", World!")
history.save()
editor.type(" Extra text")

print(f"Current: '{editor.content}'")
history.undo()  # Remove extra text
history.undo()  # Remove ", World!"
history.undo()  # Back to empty`,
  },
  {
    id: 'chain-of-responsibility',
    name: 'Chain of Responsibility',
    slug: 'chain-of-responsibility',
    category: 'Behavioral',
    description: 'Passes requests along a chain of handlers. Each handler decides to process the request or pass it to the next handler.',
    intent: 'Pass requests along a chain of handlers. Upon receiving a request, each handler decides either to process it or pass it to the next handler in the chain.',
    useCases: [
      'Middleware chains in web frameworks',
      'Request validation pipelines',
      'Event propagation in UI',
      'Logging level filtering',
      'Authentication/authorization chains',
    ],
    pros: [
      'Control the order of request handling',
      'Single Responsibility Principle: decouple classes that invoke operations from those that perform them',
      'Open/Closed Principle: introduce new handlers without breaking existing code',
      'Requests may not be handled at all',
    ],
    cons: [
      'Some requests may end up unhandled',
      'Hard to debug chain behavior',
      'Can create circular chains by mistake',
    ],
    pythonCode: `from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Optional


@dataclass
class Request:
    user: str
    token: Optional[str]
    rate_limit_count: int
    body: dict


class RequestHandler(ABC):
    def __init__(self):
        self._next: Optional['RequestHandler'] = None

    def set_next(self, handler: 'RequestHandler') -> 'RequestHandler':
        self._next = handler
        return handler  # Return for chaining

    def handle(self, request: Request) -> Optional[str]:
        if self._next:
            return self._next.handle(request)
        return None  # End of chain


class AuthHandler(RequestHandler):
    def handle(self, request: Request) -> Optional[str]:
        if not request.token:
            return f"401 Unauthorized: No token provided"
        if request.token != "valid_token":
            return f"403 Forbidden: Invalid token"
        print(f"[Auth] User '{request.user}' authenticated")
        return super().handle(request)


class RateLimitHandler(RequestHandler):
    def __init__(self, max_requests: int = 100):
        super().__init__()
        self.max_requests = max_requests

    def handle(self, request: Request) -> Optional[str]:
        if request.rate_limit_count > self.max_requests:
            return f"429 Too Many Requests: limit is {self.max_requests}/hour"
        print(f"[Rate] Count {request.rate_limit_count}/{self.max_requests} - OK")
        return super().handle(request)


class ValidationHandler(RequestHandler):
    def handle(self, request: Request) -> Optional[str]:
        if not request.body:
            return "400 Bad Request: Empty body"
        print(f"[Validation] Body valid: {request.body}")
        return super().handle(request)


class BusinessLogicHandler(RequestHandler):
    def handle(self, request: Request) -> Optional[str]:
        print(f"[Business] Processing request from '{request.user}'")
        return "200 OK: Request processed successfully"


# Build the chain
auth = AuthHandler()
rate_limit = RateLimitHandler(100)
validation = ValidationHandler()
business = BusinessLogicHandler()

auth.set_next(rate_limit).set_next(validation).set_next(business)

# Test requests
r1 = Request("alice", "valid_token", 50, {"action": "buy"})
print(auth.handle(r1))

r2 = Request("bob", None, 50, {})
print(auth.handle(r2))  # Fails auth`,
  },
  {
    id: 'visitor',
    name: 'Visitor',
    slug: 'visitor',
    category: 'Behavioral',
    description: 'Lets you add further operations to objects without having to modify them by separating the algorithm from the object structure.',
    intent: 'Separate algorithms from the objects on which they operate.',
    useCases: [
      'Compilers (AST traversal)',
      'Tax calculation on different product types',
      'File system traversal with different operations',
      'Document export in multiple formats',
      'Serialization of complex object graphs',
    ],
    pros: [
      'Open/Closed Principle: introduce a new behavior without changing classes',
      'Single Responsibility Principle: multiple versions of the same behavior in one class',
      'Accumulate state as you work with various objects',
    ],
    cons: [
      'Need to update all visitors each time a class is added/removed from hierarchy',
      'Visitors might lack access to private members',
      'Complex structure for simple use cases',
    ],
    pythonCode: `from abc import ABC, abstractmethod
from typing import List


class ShapeVisitor(ABC):
    @abstractmethod
    def visit_circle(self, circle: 'Circle') -> float:
        pass

    @abstractmethod
    def visit_rectangle(self, rect: 'Rectangle') -> float:
        pass

    @abstractmethod
    def visit_triangle(self, triangle: 'Triangle') -> float:
        pass


class Shape(ABC):
    @abstractmethod
    def accept(self, visitor: ShapeVisitor):
        pass


class Circle(Shape):
    def __init__(self, radius: float):
        self.radius = radius

    def accept(self, visitor: ShapeVisitor):
        return visitor.visit_circle(self)


class Rectangle(Shape):
    def __init__(self, width: float, height: float):
        self.width = width
        self.height = height

    def accept(self, visitor: ShapeVisitor):
        return visitor.visit_rectangle(self)


class Triangle(Shape):
    def __init__(self, base: float, height: float):
        self.base = base
        self.height = height

    def accept(self, visitor: ShapeVisitor):
        return visitor.visit_triangle(self)


# Concrete Visitors - add operations without modifying shapes
import math

class AreaCalculator(ShapeVisitor):
    def visit_circle(self, circle: Circle) -> float:
        return math.pi * circle.radius ** 2

    def visit_rectangle(self, rect: Rectangle) -> float:
        return rect.width * rect.height

    def visit_triangle(self, triangle: Triangle) -> float:
        return 0.5 * triangle.base * triangle.height


class PerimeterCalculator(ShapeVisitor):
    def visit_circle(self, circle: Circle) -> float:
        return 2 * math.pi * circle.radius

    def visit_rectangle(self, rect: Rectangle) -> float:
        return 2 * (rect.width + rect.height)

    def visit_triangle(self, triangle: Triangle) -> float:
        # Simplified for right triangle
        hyp = math.sqrt(triangle.base**2 + triangle.height**2)
        return triangle.base + triangle.height + hyp


# Usage
shapes: List[Shape] = [Circle(5), Rectangle(4, 6), Triangle(3, 4)]
area_calc = AreaCalculator()
perim_calc = PerimeterCalculator()

for shape in shapes:
    name = type(shape).__name__
    area = shape.accept(area_calc)
    perim = shape.accept(perim_calc)
    print(f"{name}: area={area:.2f}, perimeter={perim:.2f}")`,
  },
];

export function getPatternBySlug(slug: string): Pattern | undefined {
  return patterns.find((p) => p.slug === slug);
}

export function getPatternsByCategory(category: string): Pattern[] {
  if (category === 'All') return patterns;
  return patterns.filter((p) => p.category === category);
}
