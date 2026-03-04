export interface AlternativePattern {
  slug: string;
  name: string;
  reason: string;
}

export interface PatternDecisionGuide {
  goodFitSignals: string[];
  useWhen: string[];
  avoidWhen: string[];
  complexity: 'Low' | 'Medium' | 'High';
  alternatives: AlternativePattern[];
  bottomLine: string;
}

export interface MultiLangCode {
  python: string;
  java: string;
  cpp: string;
  typescript: string;
}

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
  code: MultiLangCode;
  decisionGuide: PatternDecisionGuide;
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
    code: {
      python: `import threading


class ThreadSafeSingleton:
    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
                    print("Singleton instance created")
        return cls._instance

    def get_message(self) -> str:
        return "Hello from Singleton!"


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
        return cls._instance

    def connect(self):
        if not self.connection:
            self.connection = f"Connected to {self.host}:{self.port}"
        return self.connection

    def query(self, sql: str):
        return f"Executing '{sql}' on {self.connect()}"


s1 = ThreadSafeSingleton()
s2 = ThreadSafeSingleton()
print(s1 is s2)   # True
db1 = DatabaseConnection("prod-db.example.com", 5432)
db2 = DatabaseConnection()
print(db1 is db2)  # True
print(db1.query("SELECT * FROM users"))`,
      java: `public class Singleton {
    private static volatile Singleton instance;
    private Singleton() { System.out.println("Singleton instance created"); }

    public static Singleton getInstance() {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) instance = new Singleton();
            }
        }
        return instance;
    }
    public String getMessage() { return "Hello from Singleton!"; }
}

class DatabaseConnection {
    private static volatile DatabaseConnection instance;
    private final String host;
    private final int port;
    private String connection;

    private DatabaseConnection(String host, int port) {
        this.host = host; this.port = port;
        System.out.println("New DB connection to " + host + ":" + port);
    }

    public static DatabaseConnection getInstance(String host, int port) {
        if (instance == null) {
            synchronized (DatabaseConnection.class) {
                if (instance == null) instance = new DatabaseConnection(host, port);
            }
        }
        return instance;
    }

    public String query(String sql) {
        if (connection == null) connection = "Connected to " + host + ":" + port;
        return "Executing '" + sql + "' on " + connection;
    }

    public static void main(String[] args) {
        Singleton s1 = Singleton.getInstance();
        Singleton s2 = Singleton.getInstance();
        System.out.println(s1 == s2);  // true
        DatabaseConnection db = DatabaseConnection.getInstance("prod-db.example.com", 5432);
        System.out.println(db.query("SELECT * FROM users"));
    }
}`,
      cpp: `#include <iostream>
#include <mutex>
#include <string>
using namespace std;

class Singleton {
    static Singleton* instance;
    static mutex mtx;
    Singleton() { cout << "Singleton instance created\n"; }
public:
    Singleton(const Singleton&) = delete;
    static Singleton* getInstance() {
        if (!instance) {
            lock_guard<mutex> lock(mtx);
            if (!instance) instance = new Singleton();
        }
        return instance;
    }
    string getMessage() { return "Hello from Singleton!"; }
};
Singleton* Singleton::instance = nullptr;
mutex Singleton::mtx;

class DatabaseConnection {
    static DatabaseConnection* instance;
    static mutex mtx;
    string host; int port; string conn;
    DatabaseConnection(const string& h, int p) : host(h), port(p) {
        cout << "New DB connection to " << h << ":" << p << "\n";
    }
public:
    DatabaseConnection(const DatabaseConnection&) = delete;
    static DatabaseConnection* getInstance(const string& host="localhost", int port=5432) {
        if (!instance) {
            lock_guard<mutex> lock(mtx);
            if (!instance) instance = new DatabaseConnection(host, port);
        }
        return instance;
    }
    string query(const string& sql) {
        if (conn.empty()) conn = "Connected to " + host + ":" + to_string(port);
        return "Executing '" + sql + "' on " + conn;
    }
};
DatabaseConnection* DatabaseConnection::instance = nullptr;
mutex DatabaseConnection::mtx;

int main() {
    auto* s1 = Singleton::getInstance();
    auto* s2 = Singleton::getInstance();
    cout << (s1 == s2) << "\n";  // 1
    cout << s1->getMessage() << "\n";
    auto* db = DatabaseConnection::getInstance("prod-db.example.com", 5432);
    cout << db->query("SELECT * FROM users") << "\n";
}`,
      typescript: `class ThreadSafeSingleton {
  private static instance: ThreadSafeSingleton | null = null;
  private constructor() { console.log("Singleton instance created"); }

  static getInstance(): ThreadSafeSingleton {
    if (!ThreadSafeSingleton.instance) {
      ThreadSafeSingleton.instance = new ThreadSafeSingleton();
    }
    return ThreadSafeSingleton.instance;
  }
  getMessage(): string { return "Hello from Singleton!"; }
}

class DatabaseConnection {
  private static instance: DatabaseConnection | null = null;
  private connection: string | null = null;
  private constructor(private host: string, private port: number) {
    console.log(\`New DB connection to \${host}:\${port}\`);
  }
  static getInstance(host = "localhost", port = 5432): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection(host, port);
    }
    return DatabaseConnection.instance;
  }
  query(sql: string): string {
    if (!this.connection) this.connection = \`Connected to \${this.host}:\${this.port}\`;
    return \`Executing '\${sql}' on \${this.connection}\`;
  }
}

const s1 = ThreadSafeSingleton.getInstance();
const s2 = ThreadSafeSingleton.getInstance();
console.log(s1 === s2);  // true
const db = DatabaseConnection.getInstance("prod-db.example.com", 5432);
console.log(db.query("SELECT * FROM users"));`,
    },
    decisionGuide: {
      goodFitSignals: [
        'I keep passing the same config/logger/cache object as a parameter everywhere just to share it',
        'My app accidentally creates multiple database connection pools and they compete for resources',
        'I need exactly one coordinator for a shared resource across the entire application lifetime',
        'Multiple instantiations cause race conditions or inconsistent state in my app',
      ],
      useWhen: [
        'Exactly one instance of a class must exist for the lifetime of the application',
        'You control a shared resource like a thread pool, connection pool, or device driver',
        'Global access to the instance is required but multiple instances would break the system',
      ],
      avoidWhen: [
        'You can pass the shared object via constructor injection — Singleton is global state in disguise',
        'You need to unit test the class in isolation, since Singleton leaks state between tests',
        'You run in a multi-process or serverless environment where \'one instance\' has no meaning',
      ],
      complexity: 'Low',
      alternatives: [
        {
          slug: 'factory',
          name: 'Factory Method',
          reason: 'Use Factory when you need controlled creation without enforcing a single instance',
        },
        {
          slug: 'prototype',
          name: 'Prototype',
          reason: 'Use Prototype when you need one shared template but multiple independent copies',
        },
      ],
      bottomLine: 'Reach for Singleton only when the identity constraint is a hard requirement — if a DI container can inject the same instance everywhere, prefer that instead.',
    },
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
    code: {
      python: `from abc import ABC, abstractmethod


class Notification(ABC):
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
        return f"Push to {recipient}: {message}"


class NotificationCreator(ABC):
    @abstractmethod
    def create_notification(self) -> Notification:
        pass

    def notify(self, recipient: str, message: str) -> str:
        notification = self.create_notification()
        return notification.send(recipient, message)

class EmailCreator(NotificationCreator):
    def create_notification(self) -> Notification:
        return EmailNotification()

class SMSCreator(NotificationCreator):
    def create_notification(self) -> Notification:
        return SMSNotification()


class SimpleNotificationFactory:
    @staticmethod
    def create(notification_type: str) -> Notification:
        types = {"EMAIL": EmailNotification, "SMS": SMSNotification, "PUSH": PushNotification}
        cls = types.get(notification_type.upper())
        if not cls:
            raise ValueError(f"Unknown type: {notification_type}")
        return cls()


email_creator = EmailCreator()
print(email_creator.notify("user@example.com", "Hello!"))
sms = SimpleNotificationFactory.create("SMS")
print(sms.send("+1234567890", "Verification code: 1234"))`,
      java: `abstract class Notification {
    public abstract String send(String recipient, String message);
}

class EmailNotification extends Notification {
    public String send(String recipient, String message) {
        return "Email to " + recipient + ": " + message;
    }
}

class SMSNotification extends Notification {
    public String send(String recipient, String message) {
        return "SMS to " + recipient + ": " + message;
    }
}

class PushNotification extends Notification {
    public String send(String recipient, String message) {
        return "Push to " + recipient + ": " + message;
    }
}

abstract class NotificationCreator {
    public abstract Notification createNotification();

    public String notify(String recipient, String message) {
        return createNotification().send(recipient, message);
    }
}

class EmailCreator extends NotificationCreator {
    public Notification createNotification() { return new EmailNotification(); }
}

class SMSCreator extends NotificationCreator {
    public Notification createNotification() { return new SMSNotification(); }
}

class SimpleNotificationFactory {
    public static Notification create(String type) {
        switch (type.toUpperCase()) {
            case "EMAIL": return new EmailNotification();
            case "SMS":   return new SMSNotification();
            case "PUSH":  return new PushNotification();
            default: throw new IllegalArgumentException("Unknown type: " + type);
        }
    }
    public static void main(String[] args) {
        NotificationCreator creator = new EmailCreator();
        System.out.println(creator.notify("user@example.com", "Hello!"));
        Notification sms = SimpleNotificationFactory.create("SMS");
        System.out.println(sms.send("+1234567890", "Verification code: 1234"));
    }
}`,
      cpp: `#include <iostream>
#include <memory>
#include <string>
#include <stdexcept>
using namespace std;

class Notification {
public:
    virtual string send(const string& recipient, const string& message) = 0;
    virtual ~Notification() = default;
};

class EmailNotification : public Notification {
public:
    string send(const string& r, const string& m) override {
        return "Email to " + r + ": " + m;
    }
};

class SMSNotification : public Notification {
public:
    string send(const string& r, const string& m) override {
        return "SMS to " + r + ": " + m;
    }
};

class NotificationCreator {
public:
    virtual unique_ptr<Notification> createNotification() = 0;
    string notify(const string& recipient, const string& message) {
        return createNotification()->send(recipient, message);
    }
    virtual ~NotificationCreator() = default;
};

class EmailCreator : public NotificationCreator {
public:
    unique_ptr<Notification> createNotification() override {
        return make_unique<EmailNotification>();
    }
};

class SMSCreator : public NotificationCreator {
public:
    unique_ptr<Notification> createNotification() override {
        return make_unique<SMSNotification>();
    }
};

class SimpleNotificationFactory {
public:
    static unique_ptr<Notification> create(const string& type) {
        if (type == "EMAIL") return make_unique<EmailNotification>();
        if (type == "SMS")   return make_unique<SMSNotification>();
        throw invalid_argument("Unknown type: " + type);
    }
};

int main() {
    EmailCreator creator;
    cout << creator.notify("user@example.com", "Hello!") << "\n";
    auto sms = SimpleNotificationFactory::create("SMS");
    cout << sms->send("+1234567890", "Verification code: 1234") << "\n";
}`,
      typescript: `interface Notification {
  send(recipient: string, message: string): string;
}

class EmailNotification implements Notification {
  send(recipient: string, message: string): string {
    return \`Email to \${recipient}: \${message}\`;
  }
}

class SMSNotification implements Notification {
  send(recipient: string, message: string): string {
    return \`SMS to \${recipient}: \${message}\`;
  }
}

class PushNotification implements Notification {
  send(recipient: string, message: string): string {
    return \`Push to \${recipient}: \${message}\`;
  }
}

abstract class NotificationCreator {
  abstract createNotification(): Notification;
  notify(recipient: string, message: string): string {
    return this.createNotification().send(recipient, message);
  }
}

class EmailCreator extends NotificationCreator {
  createNotification(): Notification { return new EmailNotification(); }
}

class SMSCreator extends NotificationCreator {
  createNotification(): Notification { return new SMSNotification(); }
}

class SimpleNotificationFactory {
  static create(type: string): Notification {
    const types: Record<string, new () => Notification> = {
      EMAIL: EmailNotification,
      SMS: SMSNotification,
      PUSH: PushNotification,
    };
    const Cls = types[type.toUpperCase()];
    if (!Cls) throw new Error(\`Unknown type: \${type}\`);
    return new Cls();
  }
}

const creator = new EmailCreator();
console.log(creator.notify("user@example.com", "Hello!"));
const sms = SimpleNotificationFactory.create("SMS");
console.log(sms.send("+1234567890", "Verification code: 1234"));`,
    },
    decisionGuide: {
      goodFitSignals: [
        'I have a growing if/else or switch block that picks which class to instantiate based on a type string',
        'The exact class to create is determined at runtime by user input or configuration',
        'I want to decouple the code that uses an object from the code that creates it',
        'Adding a new product type requires changes in many places across the codebase',
      ],
      useWhen: [
        'You don\'t know ahead of time which class you need to instantiate',
        'You want subclasses to control which concrete product gets created',
        'You need to centralise and standardise object creation across your codebase',
      ],
      avoidWhen: [
        'You only have one concrete product type — the added indirection is pure overhead',
        'The creation logic is trivial enough that a simple constructor call is clearer',
        'You need to create families of related objects that must match — use Abstract Factory instead',
      ],
      complexity: 'Low',
      alternatives: [
        {
          slug: 'abstract-factory',
          name: 'Abstract Factory',
          reason: 'Use Abstract Factory when products come in families that must be compatible with each other',
        },
        {
          slug: 'builder',
          name: 'Builder',
          reason: 'Use Builder when construction has many optional steps or requires a specific sequence',
        },
      ],
      bottomLine: 'If you are writing \'new XxxThing()\' inside a switch statement, move that logic into a Factory Method.',
    },
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
    code: {
      python: `from abc import ABC, abstractmethod
import sys


class Button(ABC):
    @abstractmethod
    def render(self) -> str:
        pass

class Checkbox(ABC):
    @abstractmethod
    def render(self) -> str:
        pass


class WindowsButton(Button):
    def render(self) -> str: return "Rendering Windows Button"

class WindowsCheckbox(Checkbox):
    def render(self) -> str: return "Rendering Windows Checkbox"

class MacButton(Button):
    def render(self) -> str: return "Rendering Mac Button"

class MacCheckbox(Checkbox):
    def render(self) -> str: return "Rendering Mac Checkbox"


class GUIFactory(ABC):
    @abstractmethod
    def create_button(self) -> Button: pass
    @abstractmethod
    def create_checkbox(self) -> Checkbox: pass

class WindowsFactory(GUIFactory):
    def create_button(self) -> Button: return WindowsButton()
    def create_checkbox(self) -> Checkbox: return WindowsCheckbox()

class MacFactory(GUIFactory):
    def create_button(self) -> Button: return MacButton()
    def create_checkbox(self) -> Checkbox: return MacCheckbox()


class Application:
    def __init__(self, factory: GUIFactory):
        self.button = factory.create_button()
        self.checkbox = factory.create_checkbox()

    def render(self):
        print(self.button.render())
        print(self.checkbox.render())


platform = "windows" if sys.platform == "win32" else "mac"
factory = WindowsFactory() if platform == "windows" else MacFactory()
app = Application(factory)
app.render()`,
      java: `interface Button { String render(); }
interface Checkbox { String render(); }

class WindowsButton implements Button { public String render() { return "Rendering Windows Button"; } }
class WindowsCheckbox implements Checkbox { public String render() { return "Rendering Windows Checkbox"; } }
class MacButton implements Button { public String render() { return "Rendering Mac Button"; } }
class MacCheckbox implements Checkbox { public String render() { return "Rendering Mac Checkbox"; } }

interface GUIFactory {
    Button createButton();
    Checkbox createCheckbox();
}

class WindowsFactory implements GUIFactory {
    public Button createButton() { return new WindowsButton(); }
    public Checkbox createCheckbox() { return new WindowsCheckbox(); }
}

class MacFactory implements GUIFactory {
    public Button createButton() { return new MacButton(); }
    public Checkbox createCheckbox() { return new MacCheckbox(); }
}

class Application {
    private final Button button;
    private final Checkbox checkbox;

    Application(GUIFactory factory) {
        button = factory.createButton();
        checkbox = factory.createCheckbox();
    }

    void render() {
        System.out.println(button.render());
        System.out.println(checkbox.render());
    }

    public static void main(String[] args) {
        String os = System.getProperty("os.name").toLowerCase();
        GUIFactory factory = os.contains("win") ? new WindowsFactory() : new MacFactory();
        new Application(factory).render();
    }
}`,
      cpp: `#include <iostream>
#include <memory>
using namespace std;

class Button { public: virtual string render() = 0; virtual ~Button() = default; };
class Checkbox { public: virtual string render() = 0; virtual ~Checkbox() = default; };

class WindowsButton : public Button { public: string render() override { return "Rendering Windows Button"; } };
class WindowsCheckbox : public Checkbox { public: string render() override { return "Rendering Windows Checkbox"; } };
class MacButton : public Button { public: string render() override { return "Rendering Mac Button"; } };
class MacCheckbox : public Checkbox { public: string render() override { return "Rendering Mac Checkbox"; } };

class GUIFactory {
public:
    virtual unique_ptr<Button> createButton() = 0;
    virtual unique_ptr<Checkbox> createCheckbox() = 0;
    virtual ~GUIFactory() = default;
};

class WindowsFactory : public GUIFactory {
public:
    unique_ptr<Button> createButton() override { return make_unique<WindowsButton>(); }
    unique_ptr<Checkbox> createCheckbox() override { return make_unique<WindowsCheckbox>(); }
};

class MacFactory : public GUIFactory {
public:
    unique_ptr<Button> createButton() override { return make_unique<MacButton>(); }
    unique_ptr<Checkbox> createCheckbox() override { return make_unique<MacCheckbox>(); }
};

class Application {
    unique_ptr<Button> button;
    unique_ptr<Checkbox> checkbox;
public:
    Application(GUIFactory& factory)
        : button(factory.createButton()), checkbox(factory.createCheckbox()) {}
    void render() {
        cout << button->render() << "\n" << checkbox->render() << "\n";
    }
};

int main() {
    WindowsFactory factory;
    Application app(factory);
    app.render();
}`,
      typescript: `interface Button { render(): string; }
interface Checkbox { render(): string; }

class WindowsButton implements Button { render() { return "Rendering Windows Button"; } }
class WindowsCheckbox implements Checkbox { render() { return "Rendering Windows Checkbox"; } }
class MacButton implements Button { render() { return "Rendering Mac Button"; } }
class MacCheckbox implements Checkbox { render() { return "Rendering Mac Checkbox"; } }

interface GUIFactory {
  createButton(): Button;
  createCheckbox(): Checkbox;
}

class WindowsFactory implements GUIFactory {
  createButton(): Button { return new WindowsButton(); }
  createCheckbox(): Checkbox { return new WindowsCheckbox(); }
}

class MacFactory implements GUIFactory {
  createButton(): Button { return new MacButton(); }
  createCheckbox(): Checkbox { return new MacCheckbox(); }
}

class Application {
  private button: Button;
  private checkbox: Checkbox;
  constructor(factory: GUIFactory) {
    this.button = factory.createButton();
    this.checkbox = factory.createCheckbox();
  }
  render(): void {
    console.log(this.button.render());
    console.log(this.checkbox.render());
  }
}

const factory: GUIFactory = process.platform === 'win32' ? new WindowsFactory() : new MacFactory();
const app = new Application(factory);
app.render();`,
    },
    decisionGuide: {
      goodFitSignals: [
        'My app must work with multiple families of related products (e.g., Windows vs Mac UI widgets) and they must always match',
        'I change entire product suites at once, not individual products',
        'Mixing products from different families causes visual or logical inconsistencies',
        'I\'m adding platform support and need to ensure all components come from the same platform',
      ],
      useWhen: [
        'Your system must be independent of how its products are created, composed, and represented',
        'You need to enforce that products from the same family are always used together',
        'You want to swap entire product families at runtime or via configuration',
      ],
      avoidWhen: [
        'You only have one product family — a simple Factory Method is sufficient',
        'Products in a family rarely need to co-exist — individual factories per product are simpler',
        'Adding a new product type requires changes across all factory implementations — reconsider the design',
      ],
      complexity: 'High',
      alternatives: [
        {
          slug: 'factory',
          name: 'Factory Method',
          reason: 'Use Factory Method when products don\'t come in families and are independent of each other',
        },
        {
          slug: 'builder',
          name: 'Builder',
          reason: 'Use Builder when object construction is complex and stepwise, not when compatibility between products matters',
        },
      ],
      bottomLine: 'Use Abstract Factory when swapping one product must also swap all related products — if products can be mixed independently, individual Factory Methods are simpler.',
    },
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
    code: {
      python: `from typing import Dict, Optional


class HttpRequest:
    def __init__(self, builder: 'HttpRequest.Builder'):
        self._url = builder._url
        self._method = builder._method
        self._headers = dict(builder._headers)
        self._body = builder._body
        self._timeout = builder._timeout

    def __str__(self) -> str:
        return (f"HttpRequest(url='{self._url}', method='{self._method}', "
                f"headers={self._headers}, body='{self._body}', timeout={self._timeout}ms)")

    class Builder:
        def __init__(self, url: str):
            if not url.strip():
                raise ValueError("URL cannot be empty")
            self._url = url
            self._method = "GET"
            self._headers: Dict[str, str] = {}
            self._body: Optional[str] = None
            self._timeout = 30000

        def method(self, method: str) -> 'HttpRequest.Builder':
            self._method = method.upper()
            return self

        def header(self, key: str, value: str) -> 'HttpRequest.Builder':
            self._headers[key] = value
            return self

        def body(self, body: str) -> 'HttpRequest.Builder':
            self._body = body
            return self

        def timeout(self, ms: int) -> 'HttpRequest.Builder':
            if ms > 0: self._timeout = ms
            return self

        def build(self) -> 'HttpRequest':
            return HttpRequest(self)


request = (HttpRequest.Builder("https://api.example.com/users")
    .method("POST")
    .header("Content-Type", "application/json")
    .header("Authorization", "Bearer token123")
    .body('{"name": "John", "email": "john@example.com"}')
    .timeout(5000)
    .build())

print(request)`,
      java: `import java.util.HashMap;
import java.util.Map;

class HttpRequest {
    private final String url;
    private final String method;
    private final Map<String, String> headers;
    private final String body;
    private final int timeout;

    private HttpRequest(Builder builder) {
        this.url = builder.url;
        this.method = builder.method;
        this.headers = new HashMap<>(builder.headers);
        this.body = builder.body;
        this.timeout = builder.timeout;
    }

    public String toString() {
        return "HttpRequest(url='" + url + "', method='" + method +
               "', headers=" + headers + ", body='" + body + "', timeout=" + timeout + "ms)";
    }

    static class Builder {
        private final String url;
        private String method = "GET";
        private Map<String, String> headers = new HashMap<>();
        private String body;
        private int timeout = 30000;

        Builder(String url) {
            if (url == null || url.trim().isEmpty())
                throw new IllegalArgumentException("URL cannot be empty");
            this.url = url;
        }

        Builder method(String method) { this.method = method.toUpperCase(); return this; }
        Builder header(String k, String v) { headers.put(k, v); return this; }
        Builder body(String body) { this.body = body; return this; }
        Builder timeout(int ms) { if (ms > 0) this.timeout = ms; return this; }
        HttpRequest build() { return new HttpRequest(this); }
    }

    public static void main(String[] args) {
        HttpRequest req = new HttpRequest.Builder("https://api.example.com/users")
            .method("POST")
            .header("Content-Type", "application/json")
            .header("Authorization", "Bearer token123")
            .body("{\\"name\\": \\"John\\"}")
            .timeout(5000)
            .build();
        System.out.println(req);
    }
}`,
      cpp: `#include <iostream>
#include <map>
#include <string>
#include <stdexcept>
using namespace std;

class HttpRequest {
    string url, method, body;
    map<string,string> headers;
    int timeout;
    HttpRequest() {}
public:
    string toString() const {
        return "HttpRequest(url='" + url + "', method='" + method +
               "', body='" + body + "', timeout=" + to_string(timeout) + "ms)";
    }

    class Builder {
        string url, method = "GET", body;
        map<string,string> headers;
        int timeout = 30000;
    public:
        Builder(const string& u) {
            if (u.empty()) throw invalid_argument("URL cannot be empty");
            url = u;
        }
        Builder& setMethod(const string& m) { method = m; return *this; }
        Builder& header(const string& k, const string& v) { headers[k] = v; return *this; }
        Builder& setBody(const string& b) { body = b; return *this; }
        Builder& setTimeout(int ms) { if (ms > 0) timeout = ms; return *this; }
        HttpRequest build() {
            HttpRequest r;
            r.url = url; r.method = method; r.headers = headers;
            r.body = body; r.timeout = timeout;
            return r;
        }
    };
};

int main() {
    HttpRequest req = HttpRequest::Builder("https://api.example.com/users")
        .setMethod("POST")
        .header("Content-Type", "application/json")
        .header("Authorization", "Bearer token123")
        .setBody("{\\"name\\": \\"John\\"}")
        .setTimeout(5000)
        .build();
    cout << req.toString() << "\n";
}`,
      typescript: `class HttpRequest {
  private constructor(
    private readonly url: string,
    private readonly method: string,
    private readonly headers: Record<string, string>,
    private readonly body: string | null,
    private readonly timeout: number
  ) {}

  toString(): string {
    return \`HttpRequest(url='\${this.url}', method='\${this.method}', body='\${this.body}', timeout=\${this.timeout}ms)\`;
  }

  static builder(url: string): HttpRequest.Builder {
    return new HttpRequest.Builder(url);
  }
}

namespace HttpRequest {
  export class Builder {
    private method = 'GET';
    private headers: Record<string, string> = {};
    private body: string | null = null;
    private timeout = 30000;

    constructor(private url: string) {
      if (!url.trim()) throw new Error('URL cannot be empty');
    }

    setMethod(method: string): this { this.method = method.toUpperCase(); return this; }
    header(key: string, value: string): this { this.headers[key] = value; return this; }
    setBody(body: string): this { this.body = body; return this; }
    setTimeout(ms: number): this { if (ms > 0) this.timeout = ms; return this; }

    build(): HttpRequest {
      return new (HttpRequest as any)(this.url, this.method, this.headers, this.body, this.timeout);
    }
  }
}

const request = HttpRequest.builder('https://api.example.com/users')
  .setMethod('POST')
  .header('Content-Type', 'application/json')
  .header('Authorization', 'Bearer token123')
  .setBody('{"name": "John"}')
  .setTimeout(5000)
  .build();

console.log(request.toString());`,
    },
    decisionGuide: {
      goodFitSignals: [
        'My constructor has more than 4 parameters, many of them optional, leading to confusing call sites',
        'I see many overloaded constructors or a telescoping constructor anti-pattern in my class',
        'Building the object requires a specific sequence of steps and some steps are conditional',
        'The same construction process should produce different representations of an object',
      ],
      useWhen: [
        'Object construction is complex and involves multiple optional parameters or configuration steps',
        'You want to produce different representations using the same construction process',
        'You need to enforce that all required fields are set before the object is usable',
      ],
      avoidWhen: [
        'Your object has fewer than 3-4 parameters — a plain constructor or static factory is cleaner',
        'Construction order does not matter and no validation between steps is needed',
        'You do not need to reuse the same construction steps to create different products',
      ],
      complexity: 'Medium',
      alternatives: [
        {
          slug: 'factory',
          name: 'Factory Method',
          reason: 'Use Factory Method when construction is simple and the concern is which class to instantiate, not how',
        },
        {
          slug: 'prototype',
          name: 'Prototype',
          reason: 'Use Prototype when you want a new object pre-configured from an existing one rather than building from scratch',
        },
      ],
      bottomLine: 'If your constructor looks like new User(name, null, null, true, \'admin\', null), it is time for a Builder.',
    },
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
    code: {
      python: `import copy
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


class ShapeRegistry:
    def __init__(self):
        self._prototypes: dict = {}

    def register(self, key: str, prototype: Shape):
        self._prototypes[key] = prototype

    def create(self, key: str) -> Shape:
        if key not in self._prototypes:
            raise ValueError(f"Prototype '{key}' not found")
        return self._prototypes[key].clone()


registry = ShapeRegistry()
registry.register("small_red_circle", Circle("red", 5.0))
registry.register("large_blue_rect", Rectangle("blue", 100.0, 50.0))

c1 = registry.create("small_red_circle")
c2 = registry.create("small_red_circle")
c2.color = "green"

print(c1.draw())  # Circle(color=red, radius=5.0)
print(c2.draw())  # Circle(color=green, radius=5.0)
print(c1 is c2)   # False`,
      java: `import java.util.HashMap;
import java.util.Map;

abstract class Shape implements Cloneable {
    protected String color;
    Shape(String color) { this.color = color; }
    public abstract Shape clone();
    public abstract String draw();
}

class Circle extends Shape {
    private double radius;
    Circle(String color, double radius) { super(color); this.radius = radius; }
    public Circle clone() { return new Circle(color, radius); }
    public String draw() { return "Circle(color=" + color + ", radius=" + radius + ")"; }
}

class Rectangle extends Shape {
    private double width, height;
    Rectangle(String color, double w, double h) { super(color); width=w; height=h; }
    public Rectangle clone() { return new Rectangle(color, width, height); }
    public String draw() { return "Rectangle(color=" + color + ", " + width + "x" + height + ")"; }
}

class ShapeRegistry {
    private Map<String, Shape> prototypes = new HashMap<>();
    public void register(String key, Shape s) { prototypes.put(key, s); }
    public Shape create(String key) {
        Shape p = prototypes.get(key);
        if (p == null) throw new IllegalArgumentException("Prototype not found: " + key);
        return p.clone();
    }

    public static void main(String[] args) {
        ShapeRegistry registry = new ShapeRegistry();
        registry.register("small_red_circle", new Circle("red", 5.0));
        registry.register("large_blue_rect", new Rectangle("blue", 100.0, 50.0));

        Shape c1 = registry.create("small_red_circle");
        Shape c2 = registry.create("small_red_circle");
        c2.color = "green";
        System.out.println(c1.draw());  // Circle(color=red, radius=5.0)
        System.out.println(c2.draw());  // Circle(color=green, radius=5.0)
        System.out.println(c1 == c2);   // false
    }
}`,
      cpp: `#include <iostream>
#include <memory>
#include <map>
#include <string>
#include <stdexcept>
using namespace std;

class Shape {
public:
    string color;
    Shape(const string& c) : color(c) {}
    virtual unique_ptr<Shape> clone() const = 0;
    virtual string draw() const = 0;
    virtual ~Shape() = default;
};

class Circle : public Shape {
    double radius;
public:
    Circle(const string& c, double r) : Shape(c), radius(r) {}
    unique_ptr<Shape> clone() const override { return make_unique<Circle>(*this); }
    string draw() const override {
        return "Circle(color=" + color + ", radius=" + to_string(radius) + ")";
    }
};

class Rectangle : public Shape {
    double width, height;
public:
    Rectangle(const string& c, double w, double h) : Shape(c), width(w), height(h) {}
    unique_ptr<Shape> clone() const override { return make_unique<Rectangle>(*this); }
    string draw() const override {
        return "Rectangle(color=" + color + ", " + to_string(width) + "x" + to_string(height) + ")";
    }
};

class ShapeRegistry {
    map<string, unique_ptr<Shape>> prototypes;
public:
    void registerShape(const string& key, unique_ptr<Shape> s) {
        prototypes[key] = move(s);
    }
    unique_ptr<Shape> create(const string& key) {
        auto it = prototypes.find(key);
        if (it == prototypes.end()) throw invalid_argument("Prototype not found: " + key);
        return it->second->clone();
    }
};

int main() {
    ShapeRegistry registry;
    registry.registerShape("circle", make_unique<Circle>("red", 5.0));
    auto c1 = registry.create("circle");
    auto c2 = registry.create("circle");
    c2->color = "green";
    cout << c1->draw() << "\n";  // Circle(color=red, ...)
    cout << c2->draw() << "\n";  // Circle(color=green, ...)
    cout << (c1.get() == c2.get()) << "\n";  // 0 (false)
}`,
      typescript: `abstract class Shape {
  constructor(public color: string) {}
  abstract clone(): Shape;
  abstract draw(): string;
}

class Circle extends Shape {
  constructor(color: string, public radius: number) { super(color); }
  clone(): Circle { return new Circle(this.color, this.radius); }
  draw(): string { return \`Circle(color=\${this.color}, radius=\${this.radius})\`; }
}

class Rectangle extends Shape {
  constructor(color: string, public width: number, public height: number) { super(color); }
  clone(): Rectangle { return new Rectangle(this.color, this.width, this.height); }
  draw(): string { return \`Rectangle(color=\${this.color}, \${this.width}x\${this.height})\`; }
}

class ShapeRegistry {
  private prototypes = new Map<string, Shape>();
  register(key: string, shape: Shape): void { this.prototypes.set(key, shape); }
  create(key: string): Shape {
    const p = this.prototypes.get(key);
    if (!p) throw new Error(\`Prototype not found: \${key}\`);
    return p.clone();
  }
}

const registry = new ShapeRegistry();
registry.register('circle', new Circle('red', 5));
registry.register('rect', new Rectangle('blue', 100, 50));

const c1 = registry.create('circle');
const c2 = registry.create('circle');
c2.color = 'green';
console.log(c1.draw());   // Circle(color=red, radius=5)
console.log(c2.draw());   // Circle(color=green, radius=5)
console.log(c1 === c2);   // false`,
    },
    decisionGuide: {
      goodFitSignals: [
        'Object initialisation is expensive (network, DB, computation) and I need many similar instances',
        'I need copies of objects whose concrete class I don\'t know at compile time',
        'I want to create objects dynamically based on user-configured templates at runtime',
        'Deep copying complex object graphs manually is tedious and error-prone',
      ],
      useWhen: [
        'Creating a new object is more expensive than copying an existing one',
        'You need to instantiate classes that are only known at runtime',
        'You want to reduce the number of subclasses and avoid a parallel class hierarchy',
      ],
      avoidWhen: [
        'Objects have complex circular references that make deep copying ambiguous or dangerous',
        'Construction is cheap — cloning adds complexity with no performance benefit',
        'Cloned objects must be truly independent but the object graph contains shared mutable state',
      ],
      complexity: 'Medium',
      alternatives: [
        {
          slug: 'factory',
          name: 'Factory Method',
          reason: 'Use Factory Method when you need to create fresh objects with specific types, not copies of existing ones',
        },
        {
          slug: 'builder',
          name: 'Builder',
          reason: 'Use Builder when you want to construct step-by-step rather than clone and tweak',
        },
      ],
      bottomLine: 'Reach for Prototype when you want \'give me another one just like this\' semantics and copying is cheaper than constructing from scratch.',
    },
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
    code: {
      python: `from abc import ABC, abstractmethod


class PaymentProcessor(ABC):
    @abstractmethod
    def process_payment(self, amount: float, currency: str) -> bool:
        pass


class LegacyGateway:
    def make_payment(self, amount_cents: int, currency_code: str) -> int:
        print(f"Legacy: Processing {amount_cents} cents in {currency_code}")
        return 0  # 0=success


class LegacyGatewayAdapter(PaymentProcessor):
    def __init__(self, legacy_gateway: LegacyGateway):
        self._legacy = legacy_gateway

    def process_payment(self, amount: float, currency: str) -> bool:
        amount_cents = int(amount * 100)
        status_code = self._legacy.make_payment(amount_cents, currency.upper())
        return status_code == 0


class ModernPaymentProcessor(PaymentProcessor):
    def process_payment(self, amount: float, currency: str) -> bool:
        print(f"Modern: Processing {amount:.2f} {currency}")
        return True


class CheckoutService:
    def __init__(self, processor: PaymentProcessor):
        self._processor = processor

    def checkout(self, amount: float, currency: str = "USD"):
        success = self._processor.process_payment(amount, currency)
        print(f"Checkout {'succeeded' if success else 'failed'} for {amount:.2f}")


legacy = LegacyGateway()
adapter = LegacyGatewayAdapter(legacy)
CheckoutService(adapter).checkout(29.99)

modern = ModernPaymentProcessor()
CheckoutService(modern).checkout(49.99)`,
      java: `interface PaymentProcessor {
    boolean processPayment(double amount, String currency);
}

class LegacyGateway {
    public int makePayment(int amountCents, String currencyCode) {
        System.out.println("Legacy: Processing " + amountCents + " cents in " + currencyCode);
        return 0;  // 0=success
    }
}

class LegacyGatewayAdapter implements PaymentProcessor {
    private final LegacyGateway legacy;
    LegacyGatewayAdapter(LegacyGateway legacy) { this.legacy = legacy; }

    public boolean processPayment(double amount, String currency) {
        int amountCents = (int)(amount * 100);
        int statusCode = legacy.makePayment(amountCents, currency.toUpperCase());
        return statusCode == 0;
    }
}

class ModernPaymentProcessor implements PaymentProcessor {
    public boolean processPayment(double amount, String currency) {
        System.out.printf("Modern: Processing %.2f %s%n", amount, currency);
        return true;
    }
}

class CheckoutService {
    private final PaymentProcessor processor;
    CheckoutService(PaymentProcessor processor) { this.processor = processor; }
    void checkout(double amount, String currency) {
        boolean ok = processor.processPayment(amount, currency);
        System.out.printf("Checkout %s for %.2f%n", ok ? "succeeded" : "failed", amount);
    }

    public static void main(String[] args) {
        LegacyGateway legacy = new LegacyGateway();
        PaymentProcessor adapter = new LegacyGatewayAdapter(legacy);
        new CheckoutService(adapter).checkout(29.99, "USD");

        new CheckoutService(new ModernPaymentProcessor()).checkout(49.99, "USD");
    }
}`,
      cpp: `#include <iostream>
#include <string>
using namespace std;

class PaymentProcessor {
public:
    virtual bool processPayment(double amount, const string& currency) = 0;
    virtual ~PaymentProcessor() = default;
};

class LegacyGateway {
public:
    int makePayment(int amountCents, const string& currencyCode) {
        cout << "Legacy: Processing " << amountCents << " cents in " << currencyCode << "\n";
        return 0;  // 0=success
    }
};

class LegacyGatewayAdapter : public PaymentProcessor {
    LegacyGateway& legacy;
public:
    LegacyGatewayAdapter(LegacyGateway& lg) : legacy(lg) {}
    bool processPayment(double amount, const string& currency) override {
        int cents = static_cast<int>(amount * 100);
        return legacy.makePayment(cents, currency) == 0;
    }
};

class ModernPaymentProcessor : public PaymentProcessor {
public:
    bool processPayment(double amount, const string& currency) override {
        cout << "Modern: Processing " << amount << " " << currency << "\n";
        return true;
    }
};

class CheckoutService {
    PaymentProcessor& processor;
public:
    CheckoutService(PaymentProcessor& p) : processor(p) {}
    void checkout(double amount, const string& currency = "USD") {
        bool ok = processor.processPayment(amount, currency);
        cout << "Checkout " << (ok ? "succeeded" : "failed") << " for " << amount << "\n";
    }
};

int main() {
    LegacyGateway legacy;
    LegacyGatewayAdapter adapter(legacy);
    CheckoutService(adapter).checkout(29.99);

    ModernPaymentProcessor modern;
    CheckoutService(modern).checkout(49.99);
}`,
      typescript: `interface PaymentProcessor {
  processPayment(amount: number, currency: string): boolean;
}

class LegacyGateway {
  makePayment(amountCents: number, currencyCode: string): number {
    console.log(\`Legacy: Processing \${amountCents} cents in \${currencyCode}\`);
    return 0; // 0=success
  }
}

class LegacyGatewayAdapter implements PaymentProcessor {
  constructor(private legacy: LegacyGateway) {}
  processPayment(amount: number, currency: string): boolean {
    const cents = Math.round(amount * 100);
    return this.legacy.makePayment(cents, currency.toUpperCase()) === 0;
  }
}

class ModernPaymentProcessor implements PaymentProcessor {
  processPayment(amount: number, currency: string): boolean {
    console.log(\`Modern: Processing \${amount.toFixed(2)} \${currency}\`);
    return true;
  }
}

class CheckoutService {
  constructor(private processor: PaymentProcessor) {}
  checkout(amount: number, currency = 'USD'): void {
    const ok = this.processor.processPayment(amount, currency);
    console.log(\`Checkout \${ok ? 'succeeded' : 'failed'} for \${amount.toFixed(2)}\`);
  }
}

const legacy = new LegacyGateway();
new CheckoutService(new LegacyGatewayAdapter(legacy)).checkout(29.99);
new CheckoutService(new ModernPaymentProcessor()).checkout(49.99);`,
    },
    decisionGuide: {
      goodFitSignals: [
        'I want to use an existing class but its interface does not match what my code expects',
        'I am integrating a third-party library with an incompatible API into an existing system',
        'I cannot modify the source class (legacy code, external dependency) but must interoperate with it',
        'I want to reuse several incompatible subclasses by making them conform to a common interface',
      ],
      useWhen: [
        'You want to use an existing class whose interface is incompatible with the rest of your code',
        'You need to integrate third-party or legacy code without modifying it',
        'You want to create a reusable class that cooperates with classes with incompatible interfaces',
      ],
      avoidWhen: [
        'You own both interfaces and can change one — changing the source is simpler than wrapping it',
        'The adaptation logic is so complex it warrants a full translation layer, not a thin wrapper',
        'You are adapting behaviour, not just interface — consider Decorator or Strategy instead',
      ],
      complexity: 'Low',
      alternatives: [
        {
          slug: 'bridge',
          name: 'Bridge',
          reason: 'Use Bridge when you design the abstraction and implementation from scratch to vary independently',
        },
        {
          slug: 'decorator',
          name: 'Decorator',
          reason: 'Use Decorator when you want to add behaviour rather than just adapt an existing interface',
        },
        {
          slug: 'facade',
          name: 'Facade',
          reason: 'Use Facade when you want to simplify a complex subsystem behind a new interface, not convert one interface to another',
        },
      ],
      bottomLine: 'Adapter is the right tool when you have an incompatible third-party or legacy interface you cannot change — it translates, it does not add behaviour.',
    },
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
    code: {
      python: `from abc import ABC, abstractmethod


class Renderer(ABC):
    @abstractmethod
    def render_circle(self, x: float, y: float, radius: float) -> str:
        pass
    @abstractmethod
    def render_rectangle(self, x: float, y: float, width: float, height: float) -> str:
        pass


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


class Shape(ABC):
    def __init__(self, renderer: Renderer):
        self.renderer = renderer
    @abstractmethod
    def draw(self) -> str:
        pass
    @abstractmethod
    def resize(self, factor: float):
        pass


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
        self.w *= factor; self.h *= factor


vector = VectorRenderer()
raster = RasterRenderer()
c1 = Circle(vector, 0, 0, 50)
c2 = Circle(raster, 0, 0, 50)
print(c1.draw())  # Vector: Circle at (0,0) r=50
print(c2.draw())  # Raster: Drawing 100px circle at (0,0)
c1.renderer = raster
print(c1.draw())  # Now uses raster`,
      java: `interface Renderer {
    String renderCircle(double x, double y, double radius);
    String renderRectangle(double x, double y, double w, double h);
}

class VectorRenderer implements Renderer {
    public String renderCircle(double x, double y, double r) {
        return "Vector: Circle at (" + x + "," + y + ") r=" + r;
    }
    public String renderRectangle(double x, double y, double w, double h) {
        return "Vector: Rect at (" + x + "," + y + ") " + w + "x" + h;
    }
}

class RasterRenderer implements Renderer {
    public String renderCircle(double x, double y, double r) {
        return "Raster: Drawing " + (int)(r*2) + "px circle at (" + x + "," + y + ")";
    }
    public String renderRectangle(double x, double y, double w, double h) {
        return "Raster: Drawing " + (int)w + "x" + (int)h + "px rect at (" + x + "," + y + ")";
    }
}

abstract class Shape {
    protected Renderer renderer;
    Shape(Renderer renderer) { this.renderer = renderer; }
    public abstract String draw();
    public abstract void resize(double factor);
}

class Circle extends Shape {
    double x, y, radius;
    Circle(Renderer r, double x, double y, double radius) { super(r); this.x=x; this.y=y; this.radius=radius; }
    public String draw() { return renderer.renderCircle(x, y, radius); }
    public void resize(double factor) { radius *= factor; }
}

class RectangleShape extends Shape {
    double x, y, w, h;
    RectangleShape(Renderer r, double x, double y, double w, double h) { super(r); this.x=x; this.y=y; this.w=w; this.h=h; }
    public String draw() { return renderer.renderRectangle(x, y, w, h); }
    public void resize(double f) { w*=f; h*=f; }

    public static void main(String[] args) {
        VectorRenderer vector = new VectorRenderer();
        RasterRenderer raster = new RasterRenderer();
        Circle c1 = new Circle(vector, 0, 0, 50);
        Circle c2 = new Circle(raster, 0, 0, 50);
        System.out.println(c1.draw());
        System.out.println(c2.draw());
        c1.renderer = raster;
        System.out.println(c1.draw());  // now raster
    }
}`,
      cpp: `#include <iostream>
#include <string>
#include <memory>
using namespace std;

class Renderer {
public:
    virtual string renderCircle(double x, double y, double r) = 0;
    virtual string renderRectangle(double x, double y, double w, double h) = 0;
    virtual ~Renderer() = default;
};

class VectorRenderer : public Renderer {
public:
    string renderCircle(double x, double y, double r) override {
        return "Vector: Circle at (" + to_string(x) + "," + to_string(y) + ") r=" + to_string(r);
    }
    string renderRectangle(double x, double y, double w, double h) override {
        return "Vector: Rect at (" + to_string(x) + "," + to_string(y) + ") " + to_string(w) + "x" + to_string(h);
    }
};

class RasterRenderer : public Renderer {
public:
    string renderCircle(double x, double y, double r) override {
        return "Raster: " + to_string((int)(r*2)) + "px circle at (" + to_string(x) + "," + to_string(y) + ")";
    }
    string renderRectangle(double x, double y, double w, double h) override {
        return "Raster: " + to_string((int)w) + "x" + to_string((int)h) + "px rect";
    }
};

class Shape {
protected:
    Renderer* renderer;
public:
    Shape(Renderer* r) : renderer(r) {}
    virtual string draw() = 0;
    virtual ~Shape() = default;
};

class Circle : public Shape {
    double x, y, radius;
public:
    Circle(Renderer* r, double x, double y, double rad) : Shape(r), x(x), y(y), radius(rad) {}
    string draw() override { return renderer->renderCircle(x, y, radius); }
};

int main() {
    VectorRenderer vec;
    RasterRenderer ras;
    Circle c1(&vec, 0, 0, 50);
    Circle c2(&ras, 0, 0, 50);
    cout << c1.draw() << "\n";
    cout << c2.draw() << "\n";
}`,
      typescript: `interface Renderer {
  renderCircle(x: number, y: number, radius: number): string;
  renderRectangle(x: number, y: number, w: number, h: number): string;
}

class VectorRenderer implements Renderer {
  renderCircle(x: number, y: number, r: number): string {
    return \`Vector: Circle at (\${x},\${y}) r=\${r}\`;
  }
  renderRectangle(x: number, y: number, w: number, h: number): string {
    return \`Vector: Rect at (\${x},\${y}) \${w}x\${h}\`;
  }
}

class RasterRenderer implements Renderer {
  renderCircle(x: number, y: number, r: number): string {
    return \`Raster: Drawing \${r * 2}px circle at (\${x},\${y})\`;
  }
  renderRectangle(x: number, y: number, w: number, h: number): string {
    return \`Raster: Drawing \${w}x\${h}px rect at (\${x},\${y})\`;
  }
}

abstract class Shape {
  constructor(public renderer: Renderer) {}
  abstract draw(): string;
  abstract resize(factor: number): void;
}

class Circle extends Shape {
  constructor(renderer: Renderer, public x: number, public y: number, public radius: number) {
    super(renderer);
  }
  draw(): string { return this.renderer.renderCircle(this.x, this.y, this.radius); }
  resize(factor: number): void { this.radius *= factor; }
}

const vector = new VectorRenderer();
const raster = new RasterRenderer();
const c1 = new Circle(vector, 0, 0, 50);
const c2 = new Circle(raster, 0, 0, 50);
console.log(c1.draw());  // Vector: Circle at (0,0) r=50
console.log(c2.draw());  // Raster: Drawing 100px circle at (0,0)
c1.renderer = raster;
console.log(c1.draw());  // Now uses raster`,
    },
    decisionGuide: {
      goodFitSignals: [
        'I notice my class hierarchy is exploding because I\'m combining two independent dimensions (e.g., Shape x Color)',
        'I want to switch implementations at runtime without changing the abstraction',
        'Extending the abstraction should not force me to change the implementation and vice versa',
        'Platform-specific code is leaking into platform-agnostic abstractions',
      ],
      useWhen: [
        'You want to avoid a permanent binding between abstraction and implementation',
        'Both abstraction and implementation should be extensible via subclassing independently',
        'You need to switch implementations at runtime',
      ],
      avoidWhen: [
        'You only have one implementation — the indirection of Bridge adds complexity for no gain',
        'The abstraction and implementation do not change independently — a single hierarchy is simpler',
        'You are adapting an existing interface — use Adapter instead',
      ],
      complexity: 'High',
      alternatives: [
        {
          slug: 'adapter',
          name: 'Adapter',
          reason: 'Use Adapter when bridging incompatible existing interfaces rather than designing for independence from the start',
        },
        {
          slug: 'strategy',
          name: 'Strategy',
          reason: 'Use Strategy when only the algorithm/behaviour varies, not a full implementation hierarchy',
        },
      ],
      bottomLine: 'If you find yourself creating a CartesianProduct of subclasses to cover two independent dimensions, Bridge collapses that explosion.',
    },
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
    code: {
      python: `from abc import ABC, abstractmethod
from typing import List


class FileSystemItem(ABC):
    def __init__(self, name: str):
        self.name = name

    @abstractmethod
    def get_size(self) -> int:
        pass

    @abstractmethod
    def display(self, indent: int = 0) -> str:
        pass


class File(FileSystemItem):
    def __init__(self, name: str, size: int):
        super().__init__(name)
        self.size = size

    def get_size(self) -> int:
        return self.size

    def display(self, indent: int = 0) -> str:
        return " " * indent + f"[F] {self.name} ({self.size} bytes)"


class Folder(FileSystemItem):
    def __init__(self, name: str):
        super().__init__(name)
        self.children: List[FileSystemItem] = []

    def add(self, item: FileSystemItem):
        self.children.append(item)

    def get_size(self) -> int:
        return sum(child.get_size() for child in self.children)

    def display(self, indent: int = 0) -> str:
        lines = [" " * indent + f"[D] {self.name}/"]
        for child in self.children:
            lines.append(child.display(indent + 2))
        return "\\n".join(lines)


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
      java: `import java.util.ArrayList;
import java.util.List;

abstract class FileSystemItem {
    protected String name;
    FileSystemItem(String name) { this.name = name; }
    public abstract int getSize();
    public abstract String display(int indent);
}

class File extends FileSystemItem {
    private int size;
    File(String name, int size) { super(name); this.size = size; }
    public int getSize() { return size; }
    public String display(int indent) {
        return " ".repeat(indent) + "[F] " + name + " (" + size + " bytes)";
    }
}

class Folder extends FileSystemItem {
    private List<FileSystemItem> children = new ArrayList<>();
    Folder(String name) { super(name); }
    public void add(FileSystemItem item) { children.add(item); }
    public int getSize() { return children.stream().mapToInt(FileSystemItem::getSize).sum(); }
    public String display(int indent) {
        StringBuilder sb = new StringBuilder(" ".repeat(indent) + "[D] " + name + "/");
        for (FileSystemItem child : children) {
            sb.append("\\n").append(child.display(indent + 2));
        }
        return sb.toString();
    }

    public static void main(String[] args) {
        Folder root = new Folder("root");
        Folder src = new Folder("src");
        src.add(new File("main.java", 1024));
        src.add(new File("utils.java", 512));
        Folder tests = new Folder("tests");
        tests.add(new File("MainTest.java", 768));
        root.add(src);
        root.add(tests);
        root.add(new File("README.md", 2048));
        System.out.println(root.display(0));
        System.out.println("Total size: " + root.getSize() + " bytes");
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <memory>
#include <string>
#include <numeric>
using namespace std;

class FileSystemItem {
protected:
    string name;
public:
    FileSystemItem(const string& n) : name(n) {}
    virtual int getSize() const = 0;
    virtual string display(int indent = 0) const = 0;
    virtual ~FileSystemItem() = default;
};

class File : public FileSystemItem {
    int size;
public:
    File(const string& n, int s) : FileSystemItem(n), size(s) {}
    int getSize() const override { return size; }
    string display(int indent = 0) const override {
        return string(indent, ' ') + "[F] " + name + " (" + to_string(size) + " bytes)";
    }
};

class Folder : public FileSystemItem {
    vector<unique_ptr<FileSystemItem>> children;
public:
    Folder(const string& n) : FileSystemItem(n) {}
    void add(unique_ptr<FileSystemItem> item) { children.push_back(move(item)); }
    int getSize() const override {
        int total = 0;
        for (const auto& c : children) total += c->getSize();
        return total;
    }
    string display(int indent = 0) const override {
        string result = string(indent, ' ') + "[D] " + name + "/";
        for (const auto& c : children) result += "\\n" + c->display(indent + 2);
        return result;
    }
};

int main() {
    auto root = make_unique<Folder>("root");
    auto src = make_unique<Folder>("src");
    src->add(make_unique<File>("main.cpp", 1024));
    src->add(make_unique<File>("utils.cpp", 512));
    auto tests = make_unique<Folder>("tests");
    tests->add(make_unique<File>("test_main.cpp", 768));
    root->add(move(src));
    root->add(move(tests));
    root->add(make_unique<File>("README.md", 2048));
    cout << root->display() << "\n";
    cout << "Total size: " << root->getSize() << " bytes\n";
}`,
      typescript: `abstract class FileSystemItem {
  constructor(public name: string) {}
  abstract getSize(): number;
  abstract display(indent?: number): string;
}

class File extends FileSystemItem {
  constructor(name: string, private size: number) { super(name); }
  getSize(): number { return this.size; }
  display(indent = 0): string {
    return ' '.repeat(indent) + \`[F] \${this.name} (\${this.size} bytes)\`;
  }
}

class Folder extends FileSystemItem {
  private children: FileSystemItem[] = [];
  add(item: FileSystemItem): void { this.children.push(item); }
  getSize(): number { return this.children.reduce((sum, c) => sum + c.getSize(), 0); }
  display(indent = 0): string {
    const lines = [' '.repeat(indent) + \`[D] \${this.name}/\`];
    for (const child of this.children) lines.push(child.display(indent + 2));
    return lines.join('\\n');
  }
}

const root = new Folder('root');
const src = new Folder('src');
src.add(new File('main.ts', 1024));
src.add(new File('utils.ts', 512));
const tests = new Folder('tests');
tests.add(new File('main.test.ts', 768));
root.add(src);
root.add(tests);
root.add(new File('README.md', 2048));
console.log(root.display());
console.log(\`Total size: \${root.getSize()} bytes\`);`,
    },
    decisionGuide: {
      goodFitSignals: [
        'My data naturally forms a tree: files/folders, UI components, org charts, menus with sub-menus',
        'Client code has to treat individual objects and groups of objects differently with ugly type checks',
        'I want to apply an operation recursively to a whole tree without knowing its structure at compile time',
      ],
      useWhen: [
        'You need to represent part-whole hierarchies of objects',
        'Client code should treat individual objects and compositions of objects uniformly',
        'The structure of the problem is recursive — nodes can contain other nodes',
      ],
      avoidWhen: [
        'Your tree is very shallow and the uniformity benefit does not justify the abstraction',
        'Leaf and composite objects have fundamentally different interfaces that should not be unified',
        'Performance is critical and virtual dispatch overhead in a deep tree is unacceptable',
      ],
      complexity: 'Medium',
      alternatives: [
        {
          slug: 'decorator',
          name: 'Decorator',
          reason: 'Use Decorator when you want to add responsibilities to individual objects, not model tree structures',
        },
        {
          slug: 'iterator',
          name: 'Iterator',
          reason: 'Use Iterator when the goal is to traverse the structure, not to operate on it uniformly',
        },
      ],
      bottomLine: 'If your domain has recursive containment (a thing that contains more things of the same type), Composite is almost certainly the right fit.',
    },
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
    code: {
      python: `from abc import ABC, abstractmethod


class TextView(ABC):
    @abstractmethod
    def render(self) -> str:
        pass


class PlainTextView(TextView):
    def __init__(self, text: str):
        self.text = text
    def render(self) -> str:
        return self.text


class TextDecorator(TextView, ABC):
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


text = PlainTextView("Hello, World!")
bold_text = BoldDecorator(text)
bold_italic = ItalicDecorator(bold_text)
full_style = UnderlineDecorator(ColorDecorator(bold_italic, "blue"))

print(text.render())         # Hello, World!
print(bold_text.render())    # <b>Hello, World!</b>
print(bold_italic.render())  # <i><b>Hello, World!</b></i>
print(full_style.render())   # <u><span ...>...</span></u>`,
      java: `interface TextView { String render(); }

class PlainTextView implements TextView {
    private String text;
    PlainTextView(String text) { this.text = text; }
    public String render() { return text; }
}

abstract class TextDecorator implements TextView {
    protected TextView wrapped;
    TextDecorator(TextView wrapped) { this.wrapped = wrapped; }
    public String render() { return wrapped.render(); }
}

class BoldDecorator extends TextDecorator {
    BoldDecorator(TextView w) { super(w); }
    public String render() { return "<b>" + super.render() + "</b>"; }
}

class ItalicDecorator extends TextDecorator {
    ItalicDecorator(TextView w) { super(w); }
    public String render() { return "<i>" + super.render() + "</i>"; }
}

class UnderlineDecorator extends TextDecorator {
    UnderlineDecorator(TextView w) { super(w); }
    public String render() { return "<u>" + super.render() + "</u>"; }
}

class ColorDecorator extends TextDecorator {
    private String color;
    ColorDecorator(TextView w, String color) { super(w); this.color = color; }
    public String render() { return "<span style=\\"color:" + color + "\\">" + super.render() + "</span>"; }
}

class Main {
    public static void main(String[] args) {
        TextView text = new PlainTextView("Hello, World!");
        TextView bold = new BoldDecorator(text);
        TextView boldItalic = new ItalicDecorator(bold);
        TextView full = new UnderlineDecorator(new ColorDecorator(boldItalic, "blue"));
        System.out.println(text.render());
        System.out.println(bold.render());
        System.out.println(boldItalic.render());
        System.out.println(full.render());
    }
}`,
      cpp: `#include <iostream>
#include <memory>
#include <string>
using namespace std;

class TextView {
public:
    virtual string render() const = 0;
    virtual ~TextView() = default;
};

class PlainTextView : public TextView {
    string text;
public:
    PlainTextView(const string& t) : text(t) {}
    string render() const override { return text; }
};

class TextDecorator : public TextView {
protected:
    shared_ptr<TextView> wrapped;
public:
    TextDecorator(shared_ptr<TextView> w) : wrapped(w) {}
    string render() const override { return wrapped->render(); }
};

class BoldDecorator : public TextDecorator {
public:
    BoldDecorator(shared_ptr<TextView> w) : TextDecorator(w) {}
    string render() const override { return "<b>" + wrapped->render() + "</b>"; }
};

class ItalicDecorator : public TextDecorator {
public:
    ItalicDecorator(shared_ptr<TextView> w) : TextDecorator(w) {}
    string render() const override { return "<i>" + wrapped->render() + "</i>"; }
};

class ColorDecorator : public TextDecorator {
    string color;
public:
    ColorDecorator(shared_ptr<TextView> w, const string& c) : TextDecorator(w), color(c) {}
    string render() const override {
        return "<span style=\\"color:" + color + "\\">" + wrapped->render() + "</span>";
    }
};

int main() {
    auto text = make_shared<PlainTextView>("Hello, World!");
    auto bold = make_shared<BoldDecorator>(text);
    auto boldItalic = make_shared<ItalicDecorator>(bold);
    auto full = make_shared<ColorDecorator>(boldItalic, "blue");
    cout << text->render() << "\n";
    cout << bold->render() << "\n";
    cout << boldItalic->render() << "\n";
    cout << full->render() << "\n";
}`,
      typescript: `interface TextView { render(): string; }

class PlainTextView implements TextView {
  constructor(private text: string) {}
  render(): string { return this.text; }
}

abstract class TextDecorator implements TextView {
  constructor(protected wrapped: TextView) {}
  render(): string { return this.wrapped.render(); }
}

class BoldDecorator extends TextDecorator {
  render(): string { return \`<b>\${super.render()}</b>\`; }
}

class ItalicDecorator extends TextDecorator {
  render(): string { return \`<i>\${super.render()}</i>\`; }
}

class UnderlineDecorator extends TextDecorator {
  render(): string { return \`<u>\${super.render()}</u>\`; }
}

class ColorDecorator extends TextDecorator {
  constructor(wrapped: TextView, private color: string) { super(wrapped); }
  render(): string { return \`<span style="color:\${this.color}">\${super.render()}</span>\`; }
}

const text = new PlainTextView('Hello, World!');
const bold = new BoldDecorator(text);
const boldItalic = new ItalicDecorator(bold);
const full = new UnderlineDecorator(new ColorDecorator(boldItalic, 'blue'));

console.log(text.render());        // Hello, World!
console.log(bold.render());        // <b>Hello, World!</b>
console.log(boldItalic.render());  // <i><b>Hello, World!</b></i>
console.log(full.render());        // <u><span ...>...</span></u>`,
    },
    decisionGuide: {
      goodFitSignals: [
        'I need to add optional behaviours to objects at runtime rather than to an entire class',
        'I have a combinatorial explosion of subclasses trying to cover all combinations of features',
        'I want to add cross-cutting concerns (logging, validation, caching) transparently to existing objects',
        'I cannot modify the base class but need to extend its functionality',
      ],
      useWhen: [
        'You need to add responsibilities to individual objects dynamically without affecting other objects',
        'Extending by subclassing is impractical because it leads to an explosion of subclasses',
        'You want to add and remove behaviours at runtime independently',
      ],
      avoidWhen: [
        'The order of wrapping matters in a way that is hard to reason about — consider a simpler pipeline',
        'You only ever add one behaviour — a subclass or a simple wrapper class is clearer',
        'Unwrapping or identifying the inner type at runtime is a frequent need — Decorator makes that awkward',
      ],
      complexity: 'Medium',
      alternatives: [
        {
          slug: 'composite',
          name: 'Composite',
          reason: 'Use Composite when you model part-whole trees rather than adding behaviour to individual objects',
        },
        {
          slug: 'strategy',
          name: 'Strategy',
          reason: 'Use Strategy when you want to swap entire behaviours, not stack incremental additions',
        },
        {
          slug: 'proxy',
          name: 'Proxy',
          reason: 'Use Proxy when access control, lazy initialisation, or remoting is the concern rather than feature stacking',
        },
      ],
      bottomLine: 'Decorator shines when you want to stack independent behaviours like \'logged + cached + validated\' without a subclass for each combination.',
    },
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
    code: {
      python: `class BuildSystem:
    def compile(self) -> str: return "Compiling source code..."
    def run_tests(self) -> str: return "Running unit tests... All passed!"
    def package(self) -> str: return "Packaging application..."

class VersionControlSystem:
    def checkout(self, branch: str) -> str: return f"Checking out branch: {branch}"
    def tag(self, version: str) -> str: return f"Creating tag: v{version}"

class DeploymentTarget:
    def upload(self, artifact: str) -> str: return f"Uploading {artifact} to server..."
    def restart_service(self) -> str: return "Restarting service... Done!"
    def health_check(self) -> str: return "Health check: OK"


class DeploymentFacade:
    def __init__(self):
        self._build = BuildSystem()
        self._vcs = VersionControlSystem()
        self._target = DeploymentTarget()

    def deploy(self, branch: str, version: str) -> None:
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
            print(f"  OK: {step}")
        print(f"Deployment v{version} complete!")


deployer = DeploymentFacade()
deployer.deploy("main", "2.1.0")`,
      java: `class BuildSystem {
    String compile() { return "Compiling source code..."; }
    String runTests() { return "Running unit tests... All passed!"; }
    String packageApp() { return "Packaging application..."; }
}

class VersionControlSystem {
    String checkout(String branch) { return "Checking out branch: " + branch; }
    String tag(String version) { return "Creating tag: v" + version; }
}

class DeploymentTarget {
    String upload(String artifact) { return "Uploading " + artifact + " to server..."; }
    String restartService() { return "Restarting service... Done!"; }
    String healthCheck() { return "Health check: OK"; }
}

class DeploymentFacade {
    private final BuildSystem build = new BuildSystem();
    private final VersionControlSystem vcs = new VersionControlSystem();
    private final DeploymentTarget target = new DeploymentTarget();

    public void deploy(String branch, String version) {
        String[] steps = {
            vcs.checkout(branch), build.compile(), build.runTests(), build.packageApp(),
            vcs.tag(version), target.upload("app-" + version + ".jar"),
            target.restartService(), target.healthCheck()
        };
        for (String step : steps) System.out.println("  OK: " + step);
        System.out.println("Deployment v" + version + " complete!");
    }

    public static void main(String[] args) {
        new DeploymentFacade().deploy("main", "2.1.0");
    }
}`,
      cpp: `#include <iostream>
#include <string>
using namespace std;

class BuildSystem {
public:
    string compile() { return "Compiling source code..."; }
    string runTests() { return "Running unit tests... All passed!"; }
    string packageApp() { return "Packaging application..."; }
};

class VersionControlSystem {
public:
    string checkout(const string& branch) { return "Checking out branch: " + branch; }
    string tag(const string& version) { return "Creating tag: v" + version; }
};

class DeploymentTarget {
public:
    string upload(const string& artifact) { return "Uploading " + artifact + " to server..."; }
    string restartService() { return "Restarting service... Done!"; }
    string healthCheck() { return "Health check: OK"; }
};

class DeploymentFacade {
    BuildSystem build;
    VersionControlSystem vcs;
    DeploymentTarget target;
public:
    void deploy(const string& branch, const string& version) {
        string steps[] = {
            vcs.checkout(branch), build.compile(), build.runTests(), build.packageApp(),
            vcs.tag(version), target.upload("app-" + version + ".jar"),
            target.restartService(), target.healthCheck()
        };
        for (const auto& step : steps) cout << "  OK: " << step << "\n";
        cout << "Deployment v" << version << " complete!\n";
    }
};

int main() {
    DeploymentFacade deployer;
    deployer.deploy("main", "2.1.0");
}`,
      typescript: `class BuildSystem {
  compile(): string { return 'Compiling source code...'; }
  runTests(): string { return 'Running unit tests... All passed!'; }
  packageApp(): string { return 'Packaging application...'; }
}

class VersionControlSystem {
  checkout(branch: string): string { return \`Checking out branch: \${branch}\`; }
  tag(version: string): string { return \`Creating tag: v\${version}\`; }
}

class DeploymentTarget {
  upload(artifact: string): string { return \`Uploading \${artifact} to server...\`; }
  restartService(): string { return 'Restarting service... Done!'; }
  healthCheck(): string { return 'Health check: OK'; }
}

class DeploymentFacade {
  private build = new BuildSystem();
  private vcs = new VersionControlSystem();
  private target = new DeploymentTarget();

  deploy(branch: string, version: string): void {
    const steps = [
      this.vcs.checkout(branch), this.build.compile(), this.build.runTests(),
      this.build.packageApp(), this.vcs.tag(version),
      this.target.upload(\`app-\${version}.jar\`),
      this.target.restartService(), this.target.healthCheck(),
    ];
    steps.forEach(step => console.log(\`  OK: \${step}\`));
    console.log(\`Deployment v\${version} complete!\`);
  }
}

const deployer = new DeploymentFacade();
deployer.deploy('main', '2.1.0');`,
    },
    decisionGuide: {
      goodFitSignals: [
        'Clients need to orchestrate 5+ subsystem classes to accomplish one simple task',
        'My subsystem has evolved into a tangled mess and I want to provide a clean entry point',
        'I want to layer my system so that high-level code only depends on one interface, not many',
        'Onboarding new developers is hard because the subsystem interaction is too complex',
      ],
      useWhen: [
        'You want to provide a simple interface to a complex subsystem for common use cases',
        'You want to layer your system with a well-defined entry point at each layer boundary',
        'You want to decouple clients from a subsystem so that the subsystem can evolve independently',
      ],
      avoidWhen: [
        'You need to expose the full power of the subsystem — a facade that exposes everything is no facade',
        'The subsystem is already simple enough that clients can use it directly',
        'You need to translate between interfaces — use Adapter instead of Facade',
      ],
      complexity: 'Low',
      alternatives: [
        {
          slug: 'adapter',
          name: 'Adapter',
          reason: 'Use Adapter when the goal is interface compatibility, not simplification of a complex subsystem',
        },
        {
          slug: 'mediator',
          name: 'Mediator',
          reason: 'Use Mediator when the complexity is mutual dependencies between many peers, not just subsystem exposure',
        },
      ],
      bottomLine: 'Build a Facade when you want to say \'here is the happy path\' and hide the complexity of the subsystem behind a single, stable interface.',
    },
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
    code: {
      python: `from typing import Dict


class CharacterFlyweight:
    def __init__(self, char: str, font: str, size: int):
        self.char = char  # intrinsic state (shared)
        self.font = font
        self.size = size

    def render(self, x: int, y: int, color: str) -> str:
        # extrinsic state passed in
        return f"'{self.char}' ({self.font},{self.size}pt,{color}) at ({x},{y})"


class CharacterFlyweightFactory:
    _flyweights: Dict[str, CharacterFlyweight] = {}

    @classmethod
    def get(cls, char: str, font: str, size: int) -> CharacterFlyweight:
        key = f"{char}_{font}_{size}"
        if key not in cls._flyweights:
            cls._flyweights[key] = CharacterFlyweight(char, font, size)
            print(f"Creating flyweight for '{char}'")
        return cls._flyweights[key]

    @classmethod
    def count(cls) -> int:
        return len(cls._flyweights)


class CharacterGlyph:
    def __init__(self, char: str, font: str, size: int, x: int, y: int, color: str):
        self.flyweight = CharacterFlyweightFactory.get(char, font, size)
        self.x, self.y, self.color = x, y, color

    def render(self) -> str:
        return self.flyweight.render(self.x, self.y, self.color)


text = "Hello World Hello World"
glyphs = [CharacterGlyph(c, "Arial", 12, i*10, 0, "black") for i, c in enumerate(text)]
print(f"Characters: {len(glyphs)}")
print(f"Unique flyweights: {CharacterFlyweightFactory.count()}")
print(glyphs[0].render())`,
      java: `import java.util.HashMap;
import java.util.Map;

class CharacterFlyweight {
    private final char ch;
    private final String font;
    private final int size;
    CharacterFlyweight(char ch, String font, int size) { this.ch=ch; this.font=font; this.size=size; }
    String render(int x, int y, String color) {
        return "'" + ch + "' (" + font + "," + size + "pt," + color + ") at (" + x + "," + y + ")";
    }
}

class FlyweightFactory {
    private static Map<String, CharacterFlyweight> cache = new HashMap<>();
    static CharacterFlyweight get(char ch, String font, int size) {
        String key = ch + "_" + font + "_" + size;
        return cache.computeIfAbsent(key, k -> {
            System.out.println("Creating flyweight for '" + ch + "'");
            return new CharacterFlyweight(ch, font, size);
        });
    }
    static int count() { return cache.size(); }
}

class CharacterGlyph {
    private final CharacterFlyweight flyweight;
    private final int x, y;
    private final String color;
    CharacterGlyph(char ch, String font, int size, int x, int y, String color) {
        this.flyweight = FlyweightFactory.get(ch, font, size);
        this.x=x; this.y=y; this.color=color;
    }
    String render() { return flyweight.render(x, y, color); }
}

class Main {
    public static void main(String[] args) {
        String text = "Hello World Hello World";
        CharacterGlyph[] glyphs = new CharacterGlyph[text.length()];
        for (int i = 0; i < text.length(); i++) {
            glyphs[i] = new CharacterGlyph(text.charAt(i), "Arial", 12, i*10, 0, "black");
        }
        System.out.println("Characters: " + glyphs.length);
        System.out.println("Unique flyweights: " + FlyweightFactory.count());
        System.out.println(glyphs[0].render());
    }
}`,
      cpp: `#include <iostream>
#include <map>
#include <memory>
#include <string>
using namespace std;

class CharacterFlyweight {
    char ch; string font; int size;
public:
    CharacterFlyweight(char c, const string& f, int s) : ch(c), font(f), size(s) {}
    string render(int x, int y, const string& color) const {
        return string("'") + ch + "' (" + font + "," + to_string(size) + "pt," +
               color + ") at (" + to_string(x) + "," + to_string(y) + ")";
    }
};

class FlyweightFactory {
    static map<string, shared_ptr<CharacterFlyweight>> cache;
public:
    static shared_ptr<CharacterFlyweight> get(char c, const string& font, int size) {
        string key = string(1, c) + "_" + font + "_" + to_string(size);
        if (!cache.count(key)) {
            cout << "Creating flyweight for '" << c << "'\n";
            cache[key] = make_shared<CharacterFlyweight>(c, font, size);
        }
        return cache[key];
    }
    static int count() { return cache.size(); }
};
map<string, shared_ptr<CharacterFlyweight>> FlyweightFactory::cache;

struct CharacterGlyph {
    shared_ptr<CharacterFlyweight> fw;
    int x, y; string color;
    CharacterGlyph(char c, const string& font, int size, int x, int y, const string& col)
        : fw(FlyweightFactory::get(c, font, size)), x(x), y(y), color(col) {}
    string render() const { return fw->render(x, y, color); }
};

int main() {
    string text = "Hello World Hello World";
    vector<CharacterGlyph> glyphs;
    for (int i = 0; i < (int)text.size(); i++)
        glyphs.emplace_back(text[i], "Arial", 12, i*10, 0, "black");
    cout << "Characters: " << glyphs.size() << "\n";
    cout << "Unique flyweights: " << FlyweightFactory::count() << "\n";
    cout << glyphs[0].render() << "\n";
}`,
      typescript: `class CharacterFlyweight {
  constructor(
    private readonly char: string,
    private readonly font: string,
    private readonly size: number
  ) {}

  render(x: number, y: number, color: string): string {
    return \`'\${this.char}' (\${this.font},\${this.size}pt,\${color}) at (\${x},\${y})\`;
  }
}

class FlyweightFactory {
  private static cache = new Map<string, CharacterFlyweight>();

  static get(char: string, font: string, size: number): CharacterFlyweight {
    const key = \`\${char}_\${font}_\${size}\`;
    if (!FlyweightFactory.cache.has(key)) {
      console.log(\`Creating flyweight for '\${char}'\`);
      FlyweightFactory.cache.set(key, new CharacterFlyweight(char, font, size));
    }
    return FlyweightFactory.cache.get(key)!;
  }

  static count(): number { return FlyweightFactory.cache.size; }
}

class CharacterGlyph {
  private flyweight: CharacterFlyweight;
  constructor(char: string, font: string, size: number,
              private x: number, private y: number, private color: string) {
    this.flyweight = FlyweightFactory.get(char, font, size);
  }
  render(): string { return this.flyweight.render(this.x, this.y, this.color); }
}

const text = 'Hello World Hello World';
const glyphs = Array.from(text).map((c, i) => new CharacterGlyph(c, 'Arial', 12, i*10, 0, 'black'));
console.log(\`Characters: \${glyphs.length}\`);
console.log(\`Unique flyweights: \${FlyweightFactory.count()}\`);
console.log(glyphs[0].render());`,
    },
    decisionGuide: {
      goodFitSignals: [
        'My application creates hundreds of thousands of similar objects and memory usage is becoming a problem',
        'Many objects share the same intrinsic state that could be stored once and shared',
        'Profiling shows object allocation is a memory and GC bottleneck in a tight rendering/game loop',
      ],
      useWhen: [
        'Your application must support a huge number of fine-grained objects that share most of their state',
        'Memory consumption is a measurable bottleneck caused by object proliferation',
        'The shared (intrinsic) state can be cleanly separated from the variable (extrinsic) state',
      ],
      avoidWhen: [
        'Memory is not a bottleneck — premature Flyweight optimisation adds accidental complexity',
        'Objects have significant unique state that cannot be cleanly externalised',
        'The added complexity of managing extrinsic state context outweighs the memory savings',
      ],
      complexity: 'High',
      alternatives: [
        {
          slug: 'singleton',
          name: 'Singleton',
          reason: 'Use Singleton when you need exactly one instance, not a shared pool of instances keyed by state',
        },
        {
          slug: 'prototype',
          name: 'Prototype',
          reason: 'Use Prototype when you need independent copies, not shared instances',
        },
      ],
      bottomLine: 'Flyweight is a performance pattern — profile first and reach for it only when object proliferation is a proven memory bottleneck.',
    },
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
    code: {
      python: `from abc import ABC, abstractmethod
from typing import Dict
import time


class DataService(ABC):
    @abstractmethod
    def fetch_data(self, query: str) -> dict:
        pass


class RealDataService(DataService):
    def fetch_data(self, query: str) -> dict:
        print(f"Fetching data for: {query} (slow DB call...)")
        time.sleep(0.05)
        return {"query": query, "result": f"data for {query}"}


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


real = RealDataService()
cached = CachedDataService(real)
logged = LoggingDataService(cached)

logged.fetch_data("SELECT * FROM users")   # Cache miss
logged.fetch_data("SELECT * FROM users")   # Cache hit
logged.fetch_data("SELECT * FROM orders")  # Cache miss`,
      java: `import java.util.HashMap;
import java.util.Map;

interface DataService { Map<String, String> fetchData(String query); }

class RealDataService implements DataService {
    public Map<String, String> fetchData(String query) {
        System.out.println("Fetching data for: " + query + " (slow DB call...)");
        Map<String, String> result = new HashMap<>();
        result.put("query", query);
        result.put("result", "data for " + query);
        return result;
    }
}

class CachedDataService implements DataService {
    private final DataService real;
    private final Map<String, Map<String, String>> cache = new HashMap<>();
    CachedDataService(DataService real) { this.real = real; }
    public Map<String, String> fetchData(String query) {
        if (cache.containsKey(query)) {
            System.out.println("Cache hit for: " + query);
            return cache.get(query);
        }
        System.out.println("Cache miss for: " + query);
        Map<String, String> result = real.fetchData(query);
        cache.put(query, result);
        return result;
    }
}

class LoggingDataService implements DataService {
    private final DataService service;
    private int calls = 0;
    LoggingDataService(DataService service) { this.service = service; }
    public Map<String, String> fetchData(String query) {
        System.out.println("[LOG] Call #" + (++calls) + ": fetchData('" + query + "')");
        long start = System.currentTimeMillis();
        Map<String, String> result = service.fetchData(query);
        System.out.println("[LOG] Completed in " + (System.currentTimeMillis() - start) + "ms");
        return result;
    }

    public static void main(String[] args) {
        DataService service = new LoggingDataService(new CachedDataService(new RealDataService()));
        service.fetchData("SELECT * FROM users");
        service.fetchData("SELECT * FROM users");
        service.fetchData("SELECT * FROM orders");
    }
}`,
      cpp: `#include <iostream>
#include <map>
#include <string>
#include <chrono>
using namespace std;
using Clock = chrono::high_resolution_clock;

class DataService {
public:
    virtual map<string,string> fetchData(const string& query) = 0;
    virtual ~DataService() = default;
};

class RealDataService : public DataService {
public:
    map<string,string> fetchData(const string& query) override {
        cout << "Fetching data for: " << query << " (slow DB call...)\n";
        return {{"query", query}, {"result", "data for " + query}};
    }
};

class CachedDataService : public DataService {
    DataService& real;
    map<string, map<string,string>> cache;
public:
    CachedDataService(DataService& r) : real(r) {}
    map<string,string> fetchData(const string& query) override {
        auto it = cache.find(query);
        if (it != cache.end()) { cout << "Cache hit for: " << query << "\n"; return it->second; }
        cout << "Cache miss for: " << query << "\n";
        auto result = real.fetchData(query);
        cache[query] = result;
        return result;
    }
};

class LoggingDataService : public DataService {
    DataService& service;
    int calls = 0;
public:
    LoggingDataService(DataService& s) : service(s) {}
    map<string,string> fetchData(const string& query) override {
        cout << "[LOG] Call #" << ++calls << ": fetchData('" << query << "')\n";
        auto start = Clock::now();
        auto result = service.fetchData(query);
        auto ms = chrono::duration_cast<chrono::milliseconds>(Clock::now() - start).count();
        cout << "[LOG] Completed in " << ms << "ms\n";
        return result;
    }
};

int main() {
    RealDataService real;
    CachedDataService cached(real);
    LoggingDataService logged(cached);
    logged.fetchData("SELECT * FROM users");
    logged.fetchData("SELECT * FROM users");
    logged.fetchData("SELECT * FROM orders");
}`,
      typescript: `interface DataService {
  fetchData(query: string): Record<string, string>;
}

class RealDataService implements DataService {
  fetchData(query: string): Record<string, string> {
    console.log(\`Fetching data for: \${query} (slow DB call...)\`);
    return { query, result: \`data for \${query}\` };
  }
}

class CachedDataService implements DataService {
  private cache = new Map<string, Record<string, string>>();
  constructor(private real: DataService) {}
  fetchData(query: string): Record<string, string> {
    if (this.cache.has(query)) {
      console.log(\`Cache hit for: \${query}\`);
      return this.cache.get(query)!;
    }
    console.log(\`Cache miss for: \${query}\`);
    const result = this.real.fetchData(query);
    this.cache.set(query, result);
    return result;
  }
}

class LoggingDataService implements DataService {
  private calls = 0;
  constructor(private service: DataService) {}
  fetchData(query: string): Record<string, string> {
    console.log(\`[LOG] Call #\${++this.calls}: fetchData('\${query}')\`);
    const start = Date.now();
    const result = this.service.fetchData(query);
    console.log(\`[LOG] Completed in \${Date.now() - start}ms\`);
    return result;
  }
}

const service = new LoggingDataService(new CachedDataService(new RealDataService()));
service.fetchData('SELECT * FROM users');
service.fetchData('SELECT * FROM users');
service.fetchData('SELECT * FROM orders');`,
    },
    decisionGuide: {
      goodFitSignals: [
        'I want to defer expensive object initialisation until the object is actually needed',
        'I need to add access control checks before delegating to the real object',
        'I want to cache results, log calls, or count references without modifying the real object',
        'I need a local stand-in for a remote object or a large resource that should load lazily',
      ],
      useWhen: [
        'You need lazy initialisation of a heavyweight object that is not always used',
        'You need access control, logging, caching, or reference counting around an existing object',
        'You need a local representative for a remote service or resource',
      ],
      avoidWhen: [
        'The response-time overhead of an extra indirection layer is unacceptable in a hot path',
        'You are adding new behaviour rather than controlling access — use Decorator instead',
        'The wrapped object changes its interface frequently — proxy coupling becomes a maintenance burden',
      ],
      complexity: 'Medium',
      alternatives: [
        {
          slug: 'decorator',
          name: 'Decorator',
          reason: 'Use Decorator when you want to add new behaviour, not intercept access to an existing object',
        },
        {
          slug: 'adapter',
          name: 'Adapter',
          reason: 'Use Adapter when the interface needs to change, not just the access mechanics',
        },
        {
          slug: 'facade',
          name: 'Facade',
          reason: 'Use Facade when you want to simplify a complex subsystem rather than intercept a single object',
        },
      ],
      bottomLine: 'Use Proxy when you want transparent interception (lazy load, access control, caching) around an object without the caller knowing.',
    },
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
    code: {
      python: `from abc import ABC, abstractmethod
from typing import List


class FitnessDataObserver(ABC):
    @abstractmethod
    def on_data_update(self, steps: int, calories: float, distance: float):
        pass


class FitnessData:
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
        for obs in self._observers:
            obs.on_data_update(self._steps, self._calories, self._distance)

    def update_stats(self, steps: int, calories: float, distance: float):
        self._steps = steps
        self._calories = calories
        self._distance = distance
        self._notify_all()


class LiveActivityDisplay(FitnessDataObserver):
    def on_data_update(self, steps: int, calories: float, distance: float):
        print(f"[Display] Steps: {steps} | Calories: {calories:.1f} | Distance: {distance:.2f}km")


class GoalNotifier(FitnessDataObserver):
    def __init__(self, step_goal: int):
        self.step_goal = step_goal
    def on_data_update(self, steps: int, calories: float, distance: float):
        if steps >= self.step_goal:
            print(f"[Goal] Reached {steps}/{self.step_goal} steps!")


fitness = FitnessData()
fitness.register(LiveActivityDisplay())
fitness.register(GoalNotifier(10000))
fitness.update_stats(5000, 250.5, 3.5)
print("---")
fitness.update_stats(10500, 525.0, 7.3)`,
      java: `import java.util.ArrayList;
import java.util.List;

interface FitnessObserver {
    void onDataUpdate(int steps, double calories, double distance);
}

class FitnessData {
    private List<FitnessObserver> observers = new ArrayList<>();
    private int steps; private double calories, distance;

    public void register(FitnessObserver obs) { observers.add(obs); }
    public void unregister(FitnessObserver obs) { observers.remove(obs); }

    public void updateStats(int steps, double calories, double distance) {
        this.steps = steps; this.calories = calories; this.distance = distance;
        for (FitnessObserver obs : observers) obs.onDataUpdate(steps, calories, distance);
    }
}

class LiveActivityDisplay implements FitnessObserver {
    public void onDataUpdate(int steps, double calories, double distance) {
        System.out.printf("[Display] Steps: %d | Calories: %.1f | Distance: %.2fkm%n",
            steps, calories, distance);
    }
}

class GoalNotifier implements FitnessObserver {
    private final int stepGoal;
    GoalNotifier(int goal) { this.stepGoal = goal; }
    public void onDataUpdate(int steps, double cal, double dist) {
        if (steps >= stepGoal)
            System.out.println("[Goal] Reached " + steps + "/" + stepGoal + " steps!");
    }
}

class Main {
    public static void main(String[] args) {
        FitnessData fitness = new FitnessData();
        fitness.register(new LiveActivityDisplay());
        fitness.register(new GoalNotifier(10000));
        fitness.updateStats(5000, 250.5, 3.5);
        System.out.println("---");
        fitness.updateStats(10500, 525.0, 7.3);
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

class FitnessObserver {
public:
    virtual void onDataUpdate(int steps, double calories, double distance) = 0;
    virtual ~FitnessObserver() = default;
};

class FitnessData {
    vector<FitnessObserver*> observers;
    int steps = 0; double calories = 0, distance = 0;
public:
    void subscribe(FitnessObserver* obs) { observers.push_back(obs); }
    void unsubscribe(FitnessObserver* obs) {
        observers.erase(remove(observers.begin(), observers.end(), obs), observers.end());
    }
    void updateStats(int s, double cal, double dist) {
        steps=s; calories=cal; distance=dist;
        for (auto* obs : observers) obs->onDataUpdate(steps, calories, distance);
    }
};

class LiveActivityDisplay : public FitnessObserver {
public:
    void onDataUpdate(int steps, double cal, double dist) override {
        cout << "[Display] Steps: " << steps << " | Calories: " << cal
             << " | Distance: " << dist << "km\n";
    }
};

class GoalNotifier : public FitnessObserver {
    int goal;
public:
    GoalNotifier(int g) : goal(g) {}
    void onDataUpdate(int steps, double, double) override {
        if (steps >= goal) cout << "[Goal] Reached " << steps << "/" << goal << " steps!\n";
    }
};

int main() {
    FitnessData fitness;
    LiveActivityDisplay display;
    GoalNotifier goal(10000);
    fitness.subscribe(&display);
    fitness.subscribe(&goal);
    fitness.updateStats(5000, 250.5, 3.5);
    cout << "---\n";
    fitness.updateStats(10500, 525.0, 7.3);
}`,
      typescript: `interface FitnessObserver {
  onDataUpdate(steps: number, calories: number, distance: number): void;
}

class FitnessData {
  private observers: FitnessObserver[] = [];
  private steps = 0; private calories = 0; private distance = 0;

  register(obs: FitnessObserver): void { this.observers.push(obs); }
  unregister(obs: FitnessObserver): void {
    this.observers = this.observers.filter(o => o !== obs);
  }

  updateStats(steps: number, calories: number, distance: number): void {
    this.steps = steps; this.calories = calories; this.distance = distance;
    this.observers.forEach(obs => obs.onDataUpdate(steps, calories, distance));
  }
}

class LiveActivityDisplay implements FitnessObserver {
  onDataUpdate(steps: number, calories: number, distance: number): void {
    console.log(\`[Display] Steps: \${steps} | Calories: \${calories.toFixed(1)} | Distance: \${distance.toFixed(2)}km\`);
  }
}

class GoalNotifier implements FitnessObserver {
  constructor(private stepGoal: number) {}
  onDataUpdate(steps: number): void {
    if (steps >= this.stepGoal) console.log(\`[Goal] Reached \${steps}/\${this.stepGoal} steps!\`);
  }
}

const fitness = new FitnessData();
fitness.register(new LiveActivityDisplay());
fitness.register(new GoalNotifier(10000));
fitness.updateStats(5000, 250.5, 3.5);
console.log('---');
fitness.updateStats(10500, 525.0, 7.3);`,
    },
    decisionGuide: {
      goodFitSignals: [
        'A change in one object requires updating an unknown number of other objects',
        'I have tight coupling because objects poll each other for state changes',
        'I want to implement a publish-subscribe or event bus mechanism',
        'Different modules need to react to the same domain event without knowing about each other',
      ],
      useWhen: [
        'When a change to one object requires changing an unknown number of other objects',
        'Objects should be able to notify other objects without making assumptions about who those objects are',
        'You need decoupled event-driven communication between components',
      ],
      avoidWhen: [
        'The notification chain is deep and order-dependent — debugging cascading updates is extremely hard',
        'You have only two tightly coupled objects — a direct method call is clearer',
        'Memory leaks from forgotten subscriptions are a risk and lifecycle management is complex',
      ],
      complexity: 'Medium',
      alternatives: [
        {
          slug: 'mediator',
          name: 'Mediator',
          reason: 'Use Mediator when many objects must coordinate in complex ways, not just broadcast state changes',
        },
        {
          slug: 'command',
          name: 'Command',
          reason: 'Use Command when you need undoable or queueable operations, not just notification',
        },
      ],
      bottomLine: 'Observer is the right choice when you want one-to-many reactive updates and the publisher should not care who is listening.',
    },
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
    code: {
      python: `from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import List


@dataclass
class Order:
    items: List[str]
    weight: float
    total_value: float
    destination: str


class ShippingStrategy(ABC):
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
        return 0.0 if order.total_value >= self.min_value else 9.99
    def name(self) -> str:
        return "Free Shipping (if eligible)"


class ShippingCostService:
    def __init__(self, strategy: ShippingStrategy):
        self._strategy = strategy
    def set_strategy(self, strategy: ShippingStrategy):
        self._strategy = strategy
    def calculate(self, order: Order) -> float:
        cost = self._strategy.calculate_cost(order)
        print(f"{self._strategy.name()}: \${cost:.2f}")
        return cost


order = Order(["laptop", "mouse"], weight=2.5, total_value=799.99, destination="NYC")
service = ShippingCostService(FlatRateShipping())
service.calculate(order)
service.set_strategy(WeightBasedShipping())
service.calculate(order)
service.set_strategy(FreeShipping(min_order_value=500))
service.calculate(order)`,
      java: `class Order {
    String[] items; double weight, totalValue; String destination;
    Order(String[] items, double weight, double totalValue, String destination) {
        this.items=items; this.weight=weight; this.totalValue=totalValue; this.destination=destination;
    }
}

interface ShippingStrategy {
    double calculateCost(Order order);
    String getName();
}

class FlatRateShipping implements ShippingStrategy {
    private double rate;
    FlatRateShipping(double rate) { this.rate = rate; }
    public double calculateCost(Order o) { return rate; }
    public String getName() { return "Flat Rate"; }
}

class WeightBasedShipping implements ShippingStrategy {
    private double ratePerKg;
    WeightBasedShipping(double ratePerKg) { this.ratePerKg = ratePerKg; }
    public double calculateCost(Order o) { return o.weight * ratePerKg; }
    public String getName() { return "Weight Based"; }
}

class FreeShipping implements ShippingStrategy {
    private double minValue;
    FreeShipping(double minValue) { this.minValue = minValue; }
    public double calculateCost(Order o) { return o.totalValue >= minValue ? 0.0 : 9.99; }
    public String getName() { return "Free Shipping (if eligible)"; }
}

class ShippingCostService {
    private ShippingStrategy strategy;
    ShippingCostService(ShippingStrategy strategy) { this.strategy = strategy; }
    void setStrategy(ShippingStrategy s) { this.strategy = s; }
    double calculate(Order order) {
        double cost = strategy.calculateCost(order);
        System.out.printf("%s: $%.2f%n", strategy.getName(), cost);
        return cost;
    }

    public static void main(String[] args) {
        Order order = new Order(new String[]{"laptop"}, 2.5, 799.99, "NYC");
        ShippingCostService svc = new ShippingCostService(new FlatRateShipping(5.99));
        svc.calculate(order);
        svc.setStrategy(new WeightBasedShipping(2.5));
        svc.calculate(order);
        svc.setStrategy(new FreeShipping(500));
        svc.calculate(order);
    }
}`,
      cpp: `#include <iostream>
#include <string>
using namespace std;

struct Order {
    string items; double weight, totalValue; string destination;
};

class ShippingStrategy {
public:
    virtual double calculateCost(const Order& o) = 0;
    virtual string getName() = 0;
    virtual ~ShippingStrategy() = default;
};

class FlatRateShipping : public ShippingStrategy {
    double rate;
public:
    FlatRateShipping(double r = 5.99) : rate(r) {}
    double calculateCost(const Order&) override { return rate; }
    string getName() override { return "Flat Rate"; }
};

class WeightBasedShipping : public ShippingStrategy {
    double ratePerKg;
public:
    WeightBasedShipping(double r = 2.5) : ratePerKg(r) {}
    double calculateCost(const Order& o) override { return o.weight * ratePerKg; }
    string getName() override { return "Weight Based"; }
};

class FreeShipping : public ShippingStrategy {
    double minValue;
public:
    FreeShipping(double min = 50.0) : minValue(min) {}
    double calculateCost(const Order& o) override { return o.totalValue >= minValue ? 0.0 : 9.99; }
    string getName() override { return "Free Shipping (if eligible)"; }
};

class ShippingCostService {
    ShippingStrategy* strategy;
public:
    ShippingCostService(ShippingStrategy* s) : strategy(s) {}
    void setStrategy(ShippingStrategy* s) { strategy = s; }
    double calculate(const Order& order) {
        double cost = strategy->calculateCost(order);
        cout << strategy->getName() << ": $" << cost << "\n";
        return cost;
    }
};

int main() {
    Order order{"laptop", 2.5, 799.99, "NYC"};
    FlatRateShipping flat;
    WeightBasedShipping weight;
    FreeShipping free(500);
    ShippingCostService svc(&flat);
    svc.calculate(order);
    svc.setStrategy(&weight);
    svc.calculate(order);
    svc.setStrategy(&free);
    svc.calculate(order);
}`,
      typescript: `interface Order {
  items: string[];
  weight: number;
  totalValue: number;
  destination: string;
}

interface ShippingStrategy {
  calculateCost(order: Order): number;
  name(): string;
}

class FlatRateShipping implements ShippingStrategy {
  constructor(private rate = 5.99) {}
  calculateCost(_order: Order): number { return this.rate; }
  name(): string { return 'Flat Rate'; }
}

class WeightBasedShipping implements ShippingStrategy {
  constructor(private ratePerKg = 2.5) {}
  calculateCost(order: Order): number { return order.weight * this.ratePerKg; }
  name(): string { return 'Weight Based'; }
}

class FreeShipping implements ShippingStrategy {
  constructor(private minValue = 50) {}
  calculateCost(order: Order): number { return order.totalValue >= this.minValue ? 0 : 9.99; }
  name(): string { return 'Free Shipping (if eligible)'; }
}

class ShippingCostService {
  constructor(private strategy: ShippingStrategy) {}
  setStrategy(s: ShippingStrategy): void { this.strategy = s; }
  calculate(order: Order): number {
    const cost = this.strategy.calculateCost(order);
    console.log(\`\${this.strategy.name()}: \$\${cost.toFixed(2)}\`);
    return cost;
  }
}

const order: Order = { items: ['laptop', 'mouse'], weight: 2.5, totalValue: 799.99, destination: 'NYC' };
const svc = new ShippingCostService(new FlatRateShipping());
svc.calculate(order);
svc.setStrategy(new WeightBasedShipping());
svc.calculate(order);
svc.setStrategy(new FreeShipping(500));
svc.calculate(order);`,
    },
    decisionGuide: {
      goodFitSignals: [
        'I have a large if/else or switch block that selects between different algorithms at runtime',
        'I want to swap a sorting, payment, or compression algorithm without changing the surrounding code',
        'Different variants of an algorithm are implemented as subclasses just to override one method',
        'Unit testing individual algorithms is difficult because they are buried inside a class',
      ],
      useWhen: [
        'You need to swap algorithms or behaviours at runtime without altering the clients that use them',
        'You want to isolate the implementation details of an algorithm from the code that uses it',
        'A class defines multiple behaviours that appear as conditional statements — extract each branch',
      ],
      avoidWhen: [
        'You only have one algorithm variant — the Strategy interface adds indirection for no benefit',
        'The algorithms share so much code that extracting them creates more duplication than it removes',
        'Clients never need to switch strategies — a simple method or template override is simpler',
      ],
      complexity: 'Low',
      alternatives: [
        {
          slug: 'template-method',
          name: 'Template Method',
          reason: 'Use Template Method when the algorithm skeleton is fixed and only certain steps vary via inheritance',
        },
        {
          slug: 'state',
          name: 'State',
          reason: 'Use State when the behaviour change is driven by the object\'s internal state transitions',
        },
        {
          slug: 'command',
          name: 'Command',
          reason: 'Use Command when you need undoable, queueable operations rather than just swappable algorithms',
        },
      ],
      bottomLine: 'Strategy is the object-oriented replacement for a switch/if-else block over algorithms — if you want runtime interchangeability of behaviour, this is it.',
    },
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
    code: {
      python: `from abc import ABC, abstractmethod
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

    def turn_on(self):
        self.on = True
        return f"{self.name} is ON"

    def turn_off(self):
        self.on = False
        return f"{self.name} is OFF"


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
    def __init__(self):
        self._history: List[Command] = []

    def execute(self, command: Command):
        result = command.execute()
        self._history.append(command)
        print(f"Executed: {result}")

    def undo_last(self):
        if self._history:
            result = self._history.pop().undo()
            print(f"Undone: {result}")


class MacroCommand(Command):
    def __init__(self, commands: List[Command]):
        self.commands = commands
    def execute(self) -> str:
        return " | ".join(cmd.execute() for cmd in self.commands)
    def undo(self) -> str:
        return " | ".join(cmd.undo() for cmd in reversed(self.commands))


living_room = Light("Living Room")
kitchen = Light("Kitchen")
remote = RemoteControl()
remote.execute(LightOnCommand(living_room))
remote.execute(LightOnCommand(kitchen))
remote.undo_last()
all_on = MacroCommand([LightOnCommand(living_room), LightOnCommand(kitchen)])
remote.execute(all_on)`,
      java: `import java.util.ArrayList;
import java.util.List;

interface Command { String execute(); String undo(); }

class Light {
    private String name; private boolean on;
    Light(String name) { this.name = name; }
    String turnOn() { on = true; return name + " is ON"; }
    String turnOff() { on = false; return name + " is OFF"; }
}

class LightOnCommand implements Command {
    private final Light light;
    LightOnCommand(Light light) { this.light = light; }
    public String execute() { return light.turnOn(); }
    public String undo() { return light.turnOff(); }
}

class LightOffCommand implements Command {
    private final Light light;
    LightOffCommand(Light light) { this.light = light; }
    public String execute() { return light.turnOff(); }
    public String undo() { return light.turnOn(); }
}

class RemoteControl {
    private List<Command> history = new ArrayList<>();
    void execute(Command cmd) {
        System.out.println("Executed: " + cmd.execute());
        history.add(cmd);
    }
    void undoLast() {
        if (!history.isEmpty()) {
            System.out.println("Undone: " + history.remove(history.size()-1).undo());
        }
    }
}

class MacroCommand implements Command {
    private List<Command> commands;
    MacroCommand(List<Command> cmds) { this.commands = cmds; }
    public String execute() {
        StringBuilder sb = new StringBuilder();
        for (Command c : commands) { if (sb.length() > 0) sb.append(" | "); sb.append(c.execute()); }
        return sb.toString();
    }
    public String undo() {
        StringBuilder sb = new StringBuilder();
        for (int i = commands.size()-1; i >= 0; i--) { if (sb.length() > 0) sb.append(" | "); sb.append(commands.get(i).undo()); }
        return sb.toString();
    }

    public static void main(String[] args) {
        Light livingRoom = new Light("Living Room"), kitchen = new Light("Kitchen");
        RemoteControl remote = new RemoteControl();
        remote.execute(new LightOnCommand(livingRoom));
        remote.execute(new LightOnCommand(kitchen));
        remote.undoLast();
        remote.execute(new MacroCommand(List.of(new LightOnCommand(livingRoom), new LightOnCommand(kitchen))));
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <memory>
#include <string>
using namespace std;

class Command {
public:
    virtual string execute() = 0;
    virtual string undo() = 0;
    virtual ~Command() = default;
};

class Light {
    string name; bool on = false;
public:
    Light(const string& n) : name(n) {}
    string turnOn() { on=true; return name + " is ON"; }
    string turnOff() { on=false; return name + " is OFF"; }
};

class LightOnCommand : public Command {
    Light& light;
public:
    LightOnCommand(Light& l) : light(l) {}
    string execute() override { return light.turnOn(); }
    string undo() override { return light.turnOff(); }
};

class LightOffCommand : public Command {
    Light& light;
public:
    LightOffCommand(Light& l) : light(l) {}
    string execute() override { return light.turnOff(); }
    string undo() override { return light.turnOn(); }
};

class RemoteControl {
    vector<Command*> history;
public:
    void execute(Command* cmd) {
        cout << "Executed: " << cmd->execute() << "\n";
        history.push_back(cmd);
    }
    void undoLast() {
        if (!history.empty()) {
            cout << "Undone: " << history.back()->undo() << "\n";
            history.pop_back();
        }
    }
};

int main() {
    Light livingRoom("Living Room"), kitchen("Kitchen");
    LightOnCommand onLiving(livingRoom), onKitchen(kitchen);
    RemoteControl remote;
    remote.execute(&onLiving);
    remote.execute(&onKitchen);
    remote.undoLast();
}`,
      typescript: `interface Command { execute(): string; undo(): string; }

class Light {
  private on = false;
  constructor(public name: string) {}
  turnOn(): string { this.on = true; return \`\${this.name} is ON\`; }
  turnOff(): string { this.on = false; return \`\${this.name} is OFF\`; }
}

class LightOnCommand implements Command {
  constructor(private light: Light) {}
  execute(): string { return this.light.turnOn(); }
  undo(): string { return this.light.turnOff(); }
}

class LightOffCommand implements Command {
  constructor(private light: Light) {}
  execute(): string { return this.light.turnOff(); }
  undo(): string { return this.light.turnOn(); }
}

class RemoteControl {
  private history: Command[] = [];
  execute(cmd: Command): void {
    console.log(\`Executed: \${cmd.execute()}\`);
    this.history.push(cmd);
  }
  undoLast(): void {
    const cmd = this.history.pop();
    if (cmd) console.log(\`Undone: \${cmd.undo()}\`);
  }
}

class MacroCommand implements Command {
  constructor(private commands: Command[]) {}
  execute(): string { return this.commands.map(c => c.execute()).join(' | '); }
  undo(): string { return [...this.commands].reverse().map(c => c.undo()).join(' | '); }
}

const livingRoom = new Light('Living Room');
const kitchen = new Light('Kitchen');
const remote = new RemoteControl();
remote.execute(new LightOnCommand(livingRoom));
remote.execute(new LightOnCommand(kitchen));
remote.undoLast();
remote.execute(new MacroCommand([new LightOnCommand(livingRoom), new LightOnCommand(kitchen)]));`,
    },
    decisionGuide: {
      goodFitSignals: [
        'I need undo/redo functionality and want to store the history of operations',
        'I want to queue, schedule, or execute operations at a later time',
        'I need to support transactional behaviour where a sequence of actions can be rolled back',
        'I have a menu/toolbar with items that trigger actions and want to decouple them from their handlers',
      ],
      useWhen: [
        'You need to parameterise objects with operations and support undoable operations',
        'You want to queue, log, or schedule operations for deferred execution',
        'You need to implement transactional behaviour with rollback support',
      ],
      avoidWhen: [
        'You do not need undo, queuing, or serialisation — a simple callback or function reference is lighter',
        'The command hierarchy becomes very large and the pattern overhead outweighs the benefit',
        'You only have a one-shot, non-undoable operation — just call the method directly',
      ],
      complexity: 'Medium',
      alternatives: [
        {
          slug: 'strategy',
          name: 'Strategy',
          reason: 'Use Strategy when you need interchangeable algorithms without undo/queue semantics',
        },
        {
          slug: 'memento',
          name: 'Memento',
          reason: 'Pair Memento with Command when undo needs to restore full object state, not just reverse an operation',
        },
      ],
      bottomLine: 'Reach for Command when you need to treat an action as a first-class object — especially when undo, queuing, or audit logging is a requirement.',
    },
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
    code: {
      python: `from abc import ABC, abstractmethod


class OrderState(ABC):
    @abstractmethod
    def process(self, order: 'Order') -> str: pass
    @abstractmethod
    def cancel(self, order: 'Order') -> str: pass
    @abstractmethod
    def ship(self, order: 'Order') -> str: pass


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
    def process(self, order: 'Order') -> str: return "Order already shipped"
    def cancel(self, order: 'Order') -> str: return "Cannot cancel - order already shipped!"
    def ship(self, order: 'Order') -> str: return "Order already shipped"


class CancelledState(OrderState):
    def process(self, order: 'Order') -> str: return "Cannot process cancelled order"
    def cancel(self, order: 'Order') -> str: return "Order already cancelled"
    def ship(self, order: 'Order') -> str: return "Cannot ship cancelled order"


class Order:
    def __init__(self, order_id: str):
        self.order_id = order_id
        self.state: OrderState = PendingState()

    def process(self) -> str: return self.state.process(self)
    def cancel(self) -> str: return self.state.cancel(self)
    def ship(self) -> str: return self.state.ship(self)
    def status(self) -> str: return type(self.state).__name__.replace("State", "")


order = Order("ORD-001")
print(f"Status: {order.status()}")  # Pending
print(order.ship())                  # Cannot ship - pending!
print(order.process())               # Processing
print(order.ship())                  # Shipped!
print(order.cancel())                # Cannot cancel - shipped!`,
      java: `interface OrderState {
    String process(Order order);
    String cancel(Order order);
    String ship(Order order);
}

class PendingState implements OrderState {
    public String process(Order o) { o.setState(new ProcessingState()); return "Order is now being processed"; }
    public String cancel(Order o) { o.setState(new CancelledState()); return "Order cancelled"; }
    public String ship(Order o) { return "Cannot ship - order is still pending!"; }
}

class ProcessingState implements OrderState {
    public String process(Order o) { return "Order is already being processed"; }
    public String cancel(Order o) { o.setState(new CancelledState()); return "Order cancelled (was processing)"; }
    public String ship(Order o) { o.setState(new ShippedState()); return "Order has been shipped!"; }
}

class ShippedState implements OrderState {
    public String process(Order o) { return "Order already shipped"; }
    public String cancel(Order o) { return "Cannot cancel - order already shipped!"; }
    public String ship(Order o) { return "Order already shipped"; }
}

class CancelledState implements OrderState {
    public String process(Order o) { return "Cannot process cancelled order"; }
    public String cancel(Order o) { return "Order already cancelled"; }
    public String ship(Order o) { return "Cannot ship cancelled order"; }
}

class Order {
    private String orderId;
    private OrderState state;
    Order(String id) { orderId = id; state = new PendingState(); }
    void setState(OrderState s) { state = s; }
    public String process() { return state.process(this); }
    public String cancel() { return state.cancel(this); }
    public String ship() { return state.ship(this); }
    public String status() { return state.getClass().getSimpleName().replace("State", ""); }

    public static void main(String[] args) {
        Order order = new Order("ORD-001");
        System.out.println("Status: " + order.status());
        System.out.println(order.ship());
        System.out.println(order.process());
        System.out.println(order.ship());
        System.out.println(order.cancel());
    }
}`,
      cpp: `#include <iostream>
#include <string>
#include <memory>
using namespace std;

class Order;
class OrderState {
public:
    virtual string process(Order& o) = 0;
    virtual string cancel(Order& o) = 0;
    virtual string ship(Order& o) = 0;
    virtual ~OrderState() = default;
};

class PendingState : public OrderState {
public:
    string process(Order& o) override;
    string cancel(Order& o) override;
    string ship(Order&) override { return "Cannot ship - order is still pending!"; }
};

class ProcessingState : public OrderState {
public:
    string process(Order&) override { return "Order is already being processed"; }
    string cancel(Order& o) override;
    string ship(Order& o) override;
};

class ShippedState : public OrderState {
public:
    string process(Order&) override { return "Order already shipped"; }
    string cancel(Order&) override { return "Cannot cancel - order already shipped!"; }
    string ship(Order&) override { return "Order already shipped"; }
};

class CancelledState : public OrderState {
public:
    string process(Order&) override { return "Cannot process cancelled order"; }
    string cancel(Order&) override { return "Order already cancelled"; }
    string ship(Order&) override { return "Cannot ship cancelled order"; }
};

class Order {
    unique_ptr<OrderState> state;
public:
    Order() : state(make_unique<PendingState>()) {}
    void setState(unique_ptr<OrderState> s) { state = move(s); }
    string process() { return state->process(*this); }
    string cancel() { return state->cancel(*this); }
    string ship() { return state->ship(*this); }
};

string PendingState::process(Order& o) { o.setState(make_unique<ProcessingState>()); return "Order is now being processed"; }
string PendingState::cancel(Order& o) { o.setState(make_unique<CancelledState>()); return "Order cancelled"; }
string ProcessingState::cancel(Order& o) { o.setState(make_unique<CancelledState>()); return "Order cancelled (was processing)"; }
string ProcessingState::ship(Order& o) { o.setState(make_unique<ShippedState>()); return "Order has been shipped!"; }

int main() {
    Order order;
    cout << order.ship() << "\n";
    cout << order.process() << "\n";
    cout << order.ship() << "\n";
    cout << order.cancel() << "\n";
}`,
      typescript: `interface OrderState {
  process(order: Order): string;
  cancel(order: Order): string;
  ship(order: Order): string;
}

class PendingState implements OrderState {
  process(o: Order): string { o.state = new ProcessingState(); return 'Order is now being processed'; }
  cancel(o: Order): string { o.state = new CancelledState(); return 'Order cancelled'; }
  ship(_o: Order): string { return 'Cannot ship - order is still pending!'; }
}

class ProcessingState implements OrderState {
  process(_o: Order): string { return 'Order is already being processed'; }
  cancel(o: Order): string { o.state = new CancelledState(); return 'Order cancelled (was processing)'; }
  ship(o: Order): string { o.state = new ShippedState(); return 'Order has been shipped!'; }
}

class ShippedState implements OrderState {
  process(_o: Order): string { return 'Order already shipped'; }
  cancel(_o: Order): string { return 'Cannot cancel - order already shipped!'; }
  ship(_o: Order): string { return 'Order already shipped'; }
}

class CancelledState implements OrderState {
  process(_o: Order): string { return 'Cannot process cancelled order'; }
  cancel(_o: Order): string { return 'Order already cancelled'; }
  ship(_o: Order): string { return 'Cannot ship cancelled order'; }
}

class Order {
  state: OrderState = new PendingState();
  constructor(public orderId: string) {}
  process(): string { return this.state.process(this); }
  cancel(): string { return this.state.cancel(this); }
  ship(): string { return this.state.ship(this); }
  status(): string { return this.state.constructor.name.replace('State', ''); }
}

const order = new Order('ORD-001');
console.log(\`Status: \${order.status()}\`);  // Pending
console.log(order.ship());                    // Cannot ship - pending!
console.log(order.process());                 // Processing
console.log(order.ship());                    // Shipped!
console.log(order.cancel());                  // Cannot cancel - shipped!`,
    },
    decisionGuide: {
      goodFitSignals: [
        'My class has a large switch/if-else based on an internal \'status\' or \'mode\' field',
        'The same method behaves completely differently depending on what state the object is in',
        'State transition logic is scattered across multiple methods making it hard to follow',
        'Adding a new state requires touching many methods across the class',
      ],
      useWhen: [
        'An object\'s behaviour depends on its state and it must change behaviour at runtime as state changes',
        'You have operations with large conditional statements that depend on the object\'s state',
        'State transitions are complex and state-specific behaviour needs to be encapsulated',
      ],
      avoidWhen: [
        'You have only 2-3 states with minimal state-specific logic — a simple boolean or enum is clearer',
        'State transitions never happen at runtime — the state is fixed at construction',
        'The state machine is so simple that a lookup table or state chart library is more appropriate',
      ],
      complexity: 'Medium',
      alternatives: [
        {
          slug: 'strategy',
          name: 'Strategy',
          reason: 'Use Strategy when behaviour varies by algorithm choice, not by an internal state machine with transitions',
        },
        {
          slug: 'chain-of-responsibility',
          name: 'Chain of Responsibility',
          reason: 'Use Chain of Responsibility when a request should pass through a series of handlers, not when the same object changes mode',
        },
      ],
      bottomLine: 'State Pattern is the right tool when your object acts like a finite state machine — replace the switch-on-state with polymorphic state objects.',
    },
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
    code: {
      python: `from abc import ABC, abstractmethod
from typing import List


class DataProcessor(ABC):
    def process(self, data_source: str) -> List[dict]:
        """Template method"""
        raw_data = self.read_data(data_source)
        parsed_data = self.parse_data(raw_data)
        validated_data = self.validate_data(parsed_data)
        return self.transform_data(validated_data)

    @abstractmethod
    def read_data(self, source: str) -> str:
        pass

    @abstractmethod
    def parse_data(self, raw: str) -> List[dict]:
        pass

    def validate_data(self, data: List[dict]) -> List[dict]:
        return [item for item in data if item]

    def transform_data(self, data: List[dict]) -> List[dict]:
        return data  # hook - override optionally


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
        for item in data:
            item["age"] = int(item["age"])
        return data


csv_proc = CSVProcessor()
print(f"CSV Result: {csv_proc.process('data.csv')}")

json_proc = JSONProcessor()
print(f"JSON Result: {json_proc.process('data.json')}")`,
      java: `import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

abstract class DataProcessor {
    // Template method
    public final List<Map<String,String>> process(String dataSource) {
        String raw = readData(dataSource);
        List<Map<String,String>> parsed = parseData(raw);
        List<Map<String,String>> validated = validateData(parsed);
        return transformData(validated);
    }

    protected abstract String readData(String source);
    protected abstract List<Map<String,String>> parseData(String raw);

    protected List<Map<String,String>> validateData(List<Map<String,String>> data) {
        List<Map<String,String>> result = new ArrayList<>();
        for (Map<String,String> item : data) if (!item.isEmpty()) result.add(item);
        return result;
    }

    protected List<Map<String,String>> transformData(List<Map<String,String>> data) {
        return data;
    }
}

class CSVProcessor extends DataProcessor {
    protected String readData(String source) {
        System.out.println("Reading CSV from: " + source);
        return "name,age\\nAlice,30\\nBob,25";
    }
    protected List<Map<String,String>> parseData(String raw) {
        String[] lines = raw.split("\\n");
        String[] headers = lines[0].split(",");
        List<Map<String,String>> result = new ArrayList<>();
        for (int i = 1; i < lines.length; i++) {
            String[] vals = lines[i].split(",");
            Map<String,String> row = new HashMap<>();
            for (int j = 0; j < headers.length; j++) row.put(headers[j], vals[j]);
            result.add(row);
        }
        return result;
    }
}

class Main {
    public static void main(String[] args) {
        CSVProcessor csv = new CSVProcessor();
        System.out.println("CSV Result: " + csv.process("data.csv"));
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <map>
#include <string>
#include <sstream>
using namespace std;

using Row = map<string,string>;

class DataProcessor {
public:
    // Template method
    vector<Row> process(const string& dataSource) {
        string raw = readData(dataSource);
        auto parsed = parseData(raw);
        auto validated = validateData(parsed);
        return transformData(validated);
    }

    virtual string readData(const string& source) = 0;
    virtual vector<Row> parseData(const string& raw) = 0;

    virtual vector<Row> validateData(const vector<Row>& data) { return data; }
    virtual vector<Row> transformData(const vector<Row>& data) { return data; }
    virtual ~DataProcessor() = default;
};

class CSVProcessor : public DataProcessor {
public:
    string readData(const string& source) override {
        cout << "Reading CSV from: " << source << "\n";
        return "name,age\\nAlice,30\\nBob,25";
    }
    vector<Row> parseData(const string& raw) override {
        vector<Row> result;
        istringstream ss(raw);
        string line; vector<string> headers;
        if (getline(ss, line)) {
            istringstream hl(line);
            string h; while (getline(hl, h, ',')) headers.push_back(h);
        }
        while (getline(ss, line)) {
            istringstream vl(line); Row row; int i = 0;
            string v; while (getline(vl, v, ',')) row[headers[i++]] = v;
            result.push_back(row);
        }
        return result;
    }
};

int main() {
    CSVProcessor csv;
    auto result = csv.process("data.csv");
    for (auto& row : result) {
        for (auto& [k,v] : row) cout << k << "=" << v << " ";
        cout << "\n";
    }
}`,
      typescript: `abstract class DataProcessor {
  // Template method
  process(dataSource: string): Record<string, string>[] {
    const raw = this.readData(dataSource);
    const parsed = this.parseData(raw);
    const validated = this.validateData(parsed);
    return this.transformData(validated);
  }

  protected abstract readData(source: string): string;
  protected abstract parseData(raw: string): Record<string, string>[];

  protected validateData(data: Record<string, string>[]): Record<string, string>[] {
    return data.filter(item => Object.keys(item).length > 0);
  }

  protected transformData(data: Record<string, string>[]): Record<string, string>[] {
    return data; // hook - override optionally
  }
}

class CSVProcessor extends DataProcessor {
  protected readData(source: string): string {
    console.log(\`Reading CSV from: \${source}\`);
    return 'name,age\\nAlice,30\\nBob,25';
  }
  protected parseData(raw: string): Record<string, string>[] {
    const lines = raw.trim().split('\\n');
    const headers = lines[0].split(',');
    return lines.slice(1).map(line => {
      const values = line.split(',');
      return Object.fromEntries(headers.map((h, i) => [h, values[i]]));
    });
  }
}

class JSONProcessor extends DataProcessor {
  protected readData(source: string): string {
    console.log(\`Reading JSON from: \${source}\`);
    return '[{"name":"Alice","age":"30"},{"name":"Bob","age":"25"}]';
  }
  protected parseData(raw: string): Record<string, string>[] {
    return JSON.parse(raw);
  }
  protected transformData(data: Record<string, string>[]): Record<string, string>[] {
    return data.map(item => ({ ...item, age: String(parseInt(item.age)) }));
  }
}

console.log('CSV Result:', new CSVProcessor().process('data.csv'));
console.log('JSON Result:', new JSONProcessor().process('data.json'));`,
    },
    decisionGuide: {
      goodFitSignals: [
        'I have multiple classes with the same algorithm structure but different implementations of specific steps',
        'I copy-paste boilerplate code between subclasses, changing only a few steps',
        'I want to enforce an algorithm skeleton and let subclasses customise only the hooks',
        'Cross-cutting concerns like setup and teardown should be controlled by the base class',
      ],
      useWhen: [
        'Multiple classes share the same algorithm skeleton but differ in specific steps',
        'You want to control which parts of an algorithm clients can override via hooks',
        'You want to move common behaviour to a single base class to avoid code duplication',
      ],
      avoidWhen: [
        'The algorithm skeleton itself varies — you need Strategy not Template Method',
        'Inheritance is undesirable in your design (deep hierarchies are hard to navigate)',
        'You need to change the algorithm at runtime — use Strategy (composition over inheritance)',
      ],
      complexity: 'Low',
      alternatives: [
        {
          slug: 'strategy',
          name: 'Strategy',
          reason: 'Use Strategy when the algorithm itself (not just its steps) must change at runtime via composition',
        },
        {
          slug: 'bridge',
          name: 'Bridge',
          reason: 'Use Bridge when both the abstraction and implementation need to vary independently across two hierarchies',
        },
      ],
      bottomLine: 'Template Method is the right choice when you want \'here is the fixed recipe, subclasses fill in the blanks\' — prefer Strategy if you need runtime flexibility.',
    },
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
    code: {
      python: `from typing import Iterator


class TreeNode:
    def __init__(self, value: int):
        self.value = value
        self.left = None
        self.right = None


class BinaryTree:
    def __init__(self, root: TreeNode):
        self.root = root

    def inorder(self) -> Iterator[int]:
        def traverse(node):
            if node:
                yield from traverse(node.left)
                yield node.value
                yield from traverse(node.right)
        return traverse(self.root)

    def preorder(self) -> Iterator[int]:
        def traverse(node):
            if node:
                yield node.value
                yield from traverse(node.left)
                yield from traverse(node.right)
        return traverse(self.root)

    def level_order(self) -> Iterator[int]:
        from collections import deque
        if not self.root:
            return
        queue = deque([self.root])
        while queue:
            node = queue.popleft()
            yield node.value
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)


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
print("In-order:", list(tree.inorder()))      # [1,2,3,4,5,6,7]
print("Pre-order:", list(tree.preorder()))    # [4,2,1,3,6,5,7]
print("Level-order:", list(tree.level_order())) # [4,2,6,1,3,5,7]`,
      java: `import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

class TreeNode {
    int value; TreeNode left, right;
    TreeNode(int v) { value = v; }
}

class BinaryTree implements Iterable<Integer> {
    private final TreeNode root;
    BinaryTree(TreeNode root) { this.root = root; }

    public java.util.Iterator<Integer> iterator() { return inorder().iterator(); }

    public List<Integer> inorder() {
        List<Integer> result = new ArrayList<>();
        inorder(root, result);
        return result;
    }
    private void inorder(TreeNode n, List<Integer> res) {
        if (n == null) return;
        inorder(n.left, res); res.add(n.value); inorder(n.right, res);
    }

    public List<Integer> preorder() {
        List<Integer> result = new ArrayList<>();
        preorder(root, result);
        return result;
    }
    private void preorder(TreeNode n, List<Integer> res) {
        if (n == null) return;
        res.add(n.value); preorder(n.left, res); preorder(n.right, res);
    }

    public List<Integer> levelOrder() {
        List<Integer> result = new ArrayList<>();
        if (root == null) return result;
        Queue<TreeNode> queue = new LinkedList<>();
        queue.add(root);
        while (!queue.isEmpty()) {
            TreeNode n = queue.poll();
            result.add(n.value);
            if (n.left != null) queue.add(n.left);
            if (n.right != null) queue.add(n.right);
        }
        return result;
    }

    public static void main(String[] args) {
        TreeNode root = new TreeNode(4);
        root.left = new TreeNode(2); root.right = new TreeNode(6);
        root.left.left = new TreeNode(1); root.left.right = new TreeNode(3);
        root.right.left = new TreeNode(5); root.right.right = new TreeNode(7);
        BinaryTree tree = new BinaryTree(root);
        System.out.println("In-order: " + tree.inorder());
        System.out.println("Pre-order: " + tree.preorder());
        System.out.println("Level-order: " + tree.levelOrder());
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <queue>
using namespace std;

struct TreeNode {
    int value; TreeNode* left = nullptr; TreeNode* right = nullptr;
    TreeNode(int v) : value(v) {}
};

class BinaryTree {
    TreeNode* root;
    void inorderHelper(TreeNode* n, vector<int>& res) {
        if (!n) return;
        inorderHelper(n->left, res); res.push_back(n->value); inorderHelper(n->right, res);
    }
    void preorderHelper(TreeNode* n, vector<int>& res) {
        if (!n) return;
        res.push_back(n->value); preorderHelper(n->left, res); preorderHelper(n->right, res);
    }
public:
    BinaryTree(TreeNode* r) : root(r) {}
    vector<int> inorder() { vector<int> r; inorderHelper(root, r); return r; }
    vector<int> preorder() { vector<int> r; preorderHelper(root, r); return r; }
    vector<int> levelOrder() {
        vector<int> result;
        if (!root) return result;
        queue<TreeNode*> q; q.push(root);
        while (!q.empty()) {
            auto* n = q.front(); q.pop();
            result.push_back(n->value);
            if (n->left) q.push(n->left);
            if (n->right) q.push(n->right);
        }
        return result;
    }
};

void printVec(const string& label, const vector<int>& v) {
    cout << label << ": [";
    for (int i = 0; i < (int)v.size(); i++) { if (i) cout << ","; cout << v[i]; }
    cout << "]\n";
}

int main() {
    auto* root = new TreeNode(4);
    root->left = new TreeNode(2); root->right = new TreeNode(6);
    root->left->left = new TreeNode(1); root->left->right = new TreeNode(3);
    root->right->left = new TreeNode(5); root->right->right = new TreeNode(7);
    BinaryTree tree(root);
    printVec("In-order", tree.inorder());
    printVec("Pre-order", tree.preorder());
    printVec("Level-order", tree.levelOrder());
}`,
      typescript: `class TreeNode {
  left: TreeNode | null = null;
  right: TreeNode | null = null;
  constructor(public value: number) {}
}

class BinaryTree {
  constructor(private root: TreeNode | null) {}

  *inorder(): IterableIterator<number> {
    function* traverse(node: TreeNode | null): IterableIterator<number> {
      if (!node) return;
      yield* traverse(node.left);
      yield node.value;
      yield* traverse(node.right);
    }
    yield* traverse(this.root);
  }

  *preorder(): IterableIterator<number> {
    function* traverse(node: TreeNode | null): IterableIterator<number> {
      if (!node) return;
      yield node.value;
      yield* traverse(node.left);
      yield* traverse(node.right);
    }
    yield* traverse(this.root);
  }

  levelOrder(): number[] {
    const result: number[] = [];
    if (!this.root) return result;
    const queue = [this.root];
    while (queue.length > 0) {
      const node = queue.shift()!;
      result.push(node.value);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    return result;
  }
}

const root = new TreeNode(4);
root.left = new TreeNode(2); root.right = new TreeNode(6);
root.left.left = new TreeNode(1); root.left.right = new TreeNode(3);
root.right.left = new TreeNode(5); root.right.right = new TreeNode(7);

const tree = new BinaryTree(root);
console.log('In-order:', [...tree.inorder()]);    // [1,2,3,4,5,6,7]
console.log('Pre-order:', [...tree.preorder()]);  // [4,2,1,3,6,5,7]
console.log('Level-order:', tree.levelOrder());   // [4,2,6,1,3,5,7]`,
    },
    decisionGuide: {
      goodFitSignals: [
        'I need to traverse different collection types with the same client code',
        'The collection internals (tree, graph, list) should not be exposed to the traversal consumer',
        'I want multiple independent traversals of the same collection running concurrently',
        'I want lazy or on-demand element generation rather than materialising the whole collection',
      ],
      useWhen: [
        'You want to provide a standard way to traverse a collection without exposing its internals',
        'You need to support multiple simultaneous traversals of the same collection',
        'You want to abstract over diverse collection types with a uniform interface',
      ],
      avoidWhen: [
        'Your collection is a simple array/list and a for-loop is perfectly readable',
        'The traversal is always depth-first over a tree and a recursive visitor is clearer',
        'You need to modify the collection during iteration — iterators and mutation are error-prone',
      ],
      complexity: 'Low',
      alternatives: [
        {
          slug: 'composite',
          name: 'Composite',
          reason: 'Use Composite to model the tree structure; pair with Iterator to traverse it',
        },
        {
          slug: 'visitor',
          name: 'Visitor',
          reason: 'Use Visitor when you want to apply operations across the structure, not just iterate elements',
        },
      ],
      bottomLine: 'If you are writing adapter code to make two collections behave the same way in a for-loop, you are reinventing Iterator.',
    },
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
    code: {
      python: `from abc import ABC, abstractmethod
from typing import Dict


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
        self._users: Dict[str, 'User'] = {}

    def add_user(self, user: 'User'):
        self._users[user.username] = user
        print(f"[{self.name}] {user.username} joined")

    def send_message(self, message: str, sender: 'User', recipient: str = None):
        if recipient:
            if recipient in self._users:
                self._users[recipient].receive(f"[DM from {sender.username}] {message}")
            else:
                sender.receive(f"User '{recipient}' not found")
        else:
            for name, user in self._users.items():
                if name != sender.username:
                    user.receive(f"[{self.name}] {sender.username}: {message}")


class User:
    def __init__(self, username: str, mediator: ChatMediator):
        self.username = username
        self._mediator = mediator
        mediator.add_user(self)

    def send(self, message: str, to: str = None):
        self._mediator.send_message(message, self, to)

    def receive(self, message: str):
        print(f"  -> {self.username} received: {message}")


chat = ChatRoom("Python Devs")
alice = User("Alice", chat)
bob = User("Bob", chat)
charlie = User("Charlie", chat)

alice.send("Hey everyone!")
bob.send("Hi Alice!", to="Alice")
charlie.send("Hello world!")`,
      java: `import java.util.HashMap;
import java.util.Map;

interface ChatMediator {
    void sendMessage(String message, User sender, String recipient);
    void addUser(User user);
}

class ChatRoom implements ChatMediator {
    private String name;
    private Map<String, User> users = new HashMap<>();
    ChatRoom(String name) { this.name = name; }

    public void addUser(User user) {
        users.put(user.username, user);
        System.out.println("[" + name + "] " + user.username + " joined");
    }

    public void sendMessage(String message, User sender, String recipient) {
        if (recipient != null) {
            User target = users.get(recipient);
            if (target != null) target.receive("[DM from " + sender.username + "] " + message);
            else sender.receive("User '" + recipient + "' not found");
        } else {
            for (Map.Entry<String,User> e : users.entrySet()) {
                if (!e.getKey().equals(sender.username))
                    e.getValue().receive("[" + name + "] " + sender.username + ": " + message);
            }
        }
    }
}

class User {
    String username;
    private ChatMediator mediator;
    User(String username, ChatMediator mediator) {
        this.username = username; this.mediator = mediator;
        mediator.addUser(this);
    }
    void send(String message) { mediator.sendMessage(message, this, null); }
    void sendTo(String message, String to) { mediator.sendMessage(message, this, to); }
    void receive(String message) { System.out.println("  -> " + username + " received: " + message); }

    public static void main(String[] args) {
        ChatRoom chat = new ChatRoom("Java Devs");
        User alice = new User("Alice", chat);
        User bob = new User("Bob", chat);
        User charlie = new User("Charlie", chat);
        alice.send("Hey everyone!");
        bob.sendTo("Hi Alice!", "Alice");
        charlie.send("Hello world!");
    }
}`,
      cpp: `#include <iostream>
#include <map>
#include <string>
using namespace std;

class User;

class ChatMediator {
public:
    virtual void sendMessage(const string& msg, User* sender, const string& recipient = "") = 0;
    virtual void addUser(User* user) = 0;
    virtual ~ChatMediator() = default;
};

class User {
public:
    string username;
    ChatMediator* mediator;
    User(const string& name, ChatMediator* m) : username(name), mediator(m) {
        m->addUser(this);
    }
    void send(const string& msg, const string& to = "") {
        mediator->sendMessage(msg, this, to);
    }
    void receive(const string& msg) {
        cout << "  -> " << username << " received: " << msg << "\n";
    }
};

class ChatRoom : public ChatMediator {
    string name;
    map<string, User*> users;
public:
    ChatRoom(const string& n) : name(n) {}
    void addUser(User* user) override {
        users[user->username] = user;
        cout << "[" << name << "] " << user->username << " joined\n";
    }
    void sendMessage(const string& msg, User* sender, const string& recipient = "") override {
        if (!recipient.empty()) {
            auto it = users.find(recipient);
            if (it != users.end()) it->second->receive("[DM from " + sender->username + "] " + msg);
            else sender->receive("User '" + recipient + "' not found");
        } else {
            for (auto& [name, user] : users)
                if (name != sender->username)
                    user->receive("[" + this->name + "] " + sender->username + ": " + msg);
        }
    }
};

int main() {
    ChatRoom chat("C++ Devs");
    User alice("Alice", &chat), bob("Bob", &chat), charlie("Charlie", &chat);
    alice.send("Hey everyone!");
    bob.send("Hi Alice!", "Alice");
    charlie.send("Hello world!");
}`,
      typescript: `interface ChatMediator {
  sendMessage(message: string, sender: User, recipient?: string): void;
  addUser(user: User): void;
}

class ChatRoom implements ChatMediator {
  private users = new Map<string, User>();
  constructor(public name: string) {}

  addUser(user: User): void {
    this.users.set(user.username, user);
    console.log(\`[\${this.name}] \${user.username} joined\`);
  }

  sendMessage(message: string, sender: User, recipient?: string): void {
    if (recipient) {
      const target = this.users.get(recipient);
      if (target) target.receive(\`[DM from \${sender.username}] \${message}\`);
      else sender.receive(\`User '\${recipient}' not found\`);
    } else {
      this.users.forEach((user, name) => {
        if (name !== sender.username) user.receive(\`[\${this.name}] \${sender.username}: \${message}\`);
      });
    }
  }
}

class User {
  constructor(public username: string, private mediator: ChatMediator) {
    mediator.addUser(this);
  }
  send(message: string, to?: string): void { this.mediator.sendMessage(message, this, to); }
  receive(message: string): void { console.log(\`  -> \${this.username} received: \${message}\`); }
}

const chat = new ChatRoom('TS Devs');
const alice = new User('Alice', chat);
const bob = new User('Bob', chat);
const charlie = new User('Charlie', chat);
alice.send('Hey everyone!');
bob.send('Hi Alice!', 'Alice');
charlie.send('Hello world!');`,
    },
    decisionGuide: {
      goodFitSignals: [
        'Many objects reference each other directly, making the dependency graph a tangled web',
        'Reusing a component in isolation is impossible because it drags along half the object graph',
        'Changing one object\'s collaboration protocol requires updating many other objects',
        'A chat room, UI form, or workflow engine orchestrates complex interactions between many peers',
      ],
      useWhen: [
        'A set of objects communicate in complex but well-defined ways causing tight coupling',
        'Reusing an object is hard because it refers to and communicates with many other objects',
        'You want to centralise complex coordinating logic so it does not spread across many classes',
      ],
      avoidWhen: [
        'You only have two objects interacting — a direct reference or Observer is simpler',
        'The mediator itself becomes a God Object that knows too much about all participants',
        'The interaction pattern is a simple one-to-many notification — use Observer instead',
      ],
      complexity: 'High',
      alternatives: [
        {
          slug: 'observer',
          name: 'Observer',
          reason: 'Use Observer for simple one-to-many event broadcast; Mediator is for many-to-many coordination logic',
        },
        {
          slug: 'facade',
          name: 'Facade',
          reason: 'Use Facade to simplify client access to a subsystem; Mediator coordinates peers inside the subsystem',
        },
      ],
      bottomLine: 'When the dependency graph between peers looks like spaghetti, centralise the coordination into a Mediator so every object only talks to it.',
    },
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
    code: {
      python: `from typing import List, Optional
from dataclasses import dataclass
from copy import deepcopy


@dataclass
class EditorState:
    content: str
    cursor_pos: int


class TextEditor:
    def __init__(self):
        self._content = ""
        self._cursor_pos = 0

    def type(self, text: str):
        self._content = (self._content[:self._cursor_pos] + text +
                         self._content[self._cursor_pos:])
        self._cursor_pos += len(text)

    def delete(self, count: int = 1):
        start = max(0, self._cursor_pos - count)
        self._content = self._content[:start] + self._content[self._cursor_pos:]
        self._cursor_pos = start

    def save(self) -> EditorState:
        return EditorState(self._content, self._cursor_pos)

    def restore(self, state: EditorState):
        self._content = state.content
        self._cursor_pos = state.cursor_pos

    @property
    def content(self) -> str:
        return self._content


class EditorHistory:
    def __init__(self, editor: TextEditor):
        self._editor = editor
        self._history: List[EditorState] = []

    def save(self):
        self._history.append(self._editor.save())

    def undo(self):
        if self._history:
            self._editor.restore(self._history.pop())
            print(f"Undone. Content: '{self._editor.content}'")
        else:
            print("Nothing to undo!")


editor = TextEditor()
history = EditorHistory(editor)
history.save()
editor.type("Hello")
history.save()
editor.type(", World!")
history.save()
editor.type(" Extra text")
print(f"Current: '{editor.content}'")
history.undo()
history.undo()
history.undo()`,
      java: `import java.util.ArrayDeque;
import java.util.Deque;

class EditorState {
    final String content;
    final int cursorPos;
    EditorState(String content, int cursorPos) {
        this.content = content; this.cursorPos = cursorPos;
    }
}

class TextEditor {
    private String content = "";
    private int cursorPos = 0;

    public void type(String text) {
        content = content.substring(0, cursorPos) + text + content.substring(cursorPos);
        cursorPos += text.length();
    }

    public void delete(int count) {
        int start = Math.max(0, cursorPos - count);
        content = content.substring(0, start) + content.substring(cursorPos);
        cursorPos = start;
    }

    public EditorState save() { return new EditorState(content, cursorPos); }

    public void restore(EditorState state) {
        content = state.content; cursorPos = state.cursorPos;
    }

    public String getContent() { return content; }
}

class EditorHistory {
    private final TextEditor editor;
    private final Deque<EditorState> history = new ArrayDeque<>();
    EditorHistory(TextEditor editor) { this.editor = editor; }

    public void save() { history.push(editor.save()); }

    public void undo() {
        if (!history.isEmpty()) {
            editor.restore(history.pop());
            System.out.println("Undone. Content: '" + editor.getContent() + "'");
        } else {
            System.out.println("Nothing to undo!");
        }
    }

    public static void main(String[] args) {
        TextEditor editor = new TextEditor();
        EditorHistory history = new EditorHistory(editor);
        history.save();
        editor.type("Hello");
        history.save();
        editor.type(", World!");
        history.save();
        editor.type(" Extra text");
        System.out.println("Current: '" + editor.getContent() + "'");
        history.undo();
        history.undo();
        history.undo();
    }
}`,
      cpp: `#include <iostream>
#include <string>
#include <vector>
using namespace std;

struct EditorState {
    string content;
    int cursorPos;
};

class TextEditor {
    string content;
    int cursorPos = 0;
public:
    void type(const string& text) {
        content = content.substr(0, cursorPos) + text + content.substr(cursorPos);
        cursorPos += text.length();
    }
    void del(int count = 1) {
        int start = max(0, cursorPos - count);
        content = content.substr(0, start) + content.substr(cursorPos);
        cursorPos = start;
    }
    EditorState save() const { return {content, cursorPos}; }
    void restore(const EditorState& state) { content = state.content; cursorPos = state.cursorPos; }
    string getContent() const { return content; }
};

class EditorHistory {
    TextEditor& editor;
    vector<EditorState> history;
public:
    EditorHistory(TextEditor& e) : editor(e) {}
    void save() { history.push_back(editor.save()); }
    void undo() {
        if (!history.empty()) {
            editor.restore(history.back()); history.pop_back();
            cout << "Undone. Content: '" << editor.getContent() << "'\n";
        } else cout << "Nothing to undo!\n";
    }
};

int main() {
    TextEditor editor;
    EditorHistory history(editor);
    history.save();
    editor.type("Hello");
    history.save();
    editor.type(", World!");
    history.save();
    editor.type(" Extra text");
    cout << "Current: '" << editor.getContent() << "'\n";
    history.undo();
    history.undo();
    history.undo();
}`,
      typescript: `interface EditorState {
  content: string;
  cursorPos: number;
}

class TextEditor {
  private content = '';
  private cursorPos = 0;

  type(text: string): void {
    this.content = this.content.slice(0, this.cursorPos) + text + this.content.slice(this.cursorPos);
    this.cursorPos += text.length;
  }

  delete(count = 1): void {
    const start = Math.max(0, this.cursorPos - count);
    this.content = this.content.slice(0, start) + this.content.slice(this.cursorPos);
    this.cursorPos = start;
  }

  save(): EditorState { return { content: this.content, cursorPos: this.cursorPos }; }

  restore(state: EditorState): void {
    this.content = state.content;
    this.cursorPos = state.cursorPos;
  }

  getContent(): string { return this.content; }
}

class EditorHistory {
  private history: EditorState[] = [];
  constructor(private editor: TextEditor) {}

  save(): void { this.history.push(this.editor.save()); }

  undo(): void {
    const state = this.history.pop();
    if (state) {
      this.editor.restore(state);
      console.log(\`Undone. Content: '\${this.editor.getContent()}'\`);
    } else {
      console.log('Nothing to undo!');
    }
  }
}

const editor = new TextEditor();
const history = new EditorHistory(editor);
history.save();
editor.type('Hello');
history.save();
editor.type(', World!');
history.save();
editor.type(' Extra text');
console.log(\`Current: '\${editor.getContent()}'\`);
history.undo();
history.undo();
history.undo();`,
    },
    decisionGuide: {
      goodFitSignals: [
        'I need to implement undo/redo and want to save snapshots of object state without exposing internals',
        'Users expect to save and restore checkpoints (game saves, document history, draft versions)',
        'I need to rollback an object to a previous state after a failed transaction',
        'The state I need to save is complex and should not be reconstructed by external code',
      ],
      useWhen: [
        'You need to produce snapshots of an object\'s state to restore it later',
        'Exposing the object\'s internal state for snapshot purposes would violate its encapsulation',
        'You need undo/redo functionality where each step captures a snapshot',
      ],
      avoidWhen: [
        'The state to capture is very large — storing many mementos will consume too much memory',
        'Clients need to inspect the saved state — if you expose internals, you break encapsulation',
        'State can be reconstructed by replaying a log of commands — Command + event sourcing may be better',
      ],
      complexity: 'Medium',
      alternatives: [
        {
          slug: 'command',
          name: 'Command',
          reason: 'Pair Command with Memento: Commands drive operations, Mementos capture state for undo',
        },
        {
          slug: 'prototype',
          name: 'Prototype',
          reason: 'Use Prototype when a full deep clone is an acceptable snapshot mechanism',
        },
      ],
      bottomLine: 'Memento lets you implement undo without breaking encapsulation — the originator saves and restores its own state through opaque snapshot objects.',
    },
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
    code: {
      python: `from abc import ABC, abstractmethod
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
        return handler

    def handle(self, request: Request) -> Optional[str]:
        if self._next:
            return self._next.handle(request)
        return None


class AuthHandler(RequestHandler):
    def handle(self, request: Request) -> Optional[str]:
        if not request.token:
            return "401 Unauthorized: No token provided"
        if request.token != "valid_token":
            return "403 Forbidden: Invalid token"
        print(f"[Auth] User '{request.user}' authenticated")
        return super().handle(request)


class RateLimitHandler(RequestHandler):
    def __init__(self, max_requests: int = 100):
        super().__init__()
        self.max_requests = max_requests

    def handle(self, request: Request) -> Optional[str]:
        if request.rate_limit_count > self.max_requests:
            return f"429 Too Many Requests: limit is {self.max_requests}/hour"
        print(f"[Rate] {request.rate_limit_count}/{self.max_requests} - OK")
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


auth = AuthHandler()
rate_limit = RateLimitHandler(100)
validation = ValidationHandler()
business = BusinessLogicHandler()
auth.set_next(rate_limit).set_next(validation).set_next(business)

r1 = Request("alice", "valid_token", 50, {"action": "buy"})
print(auth.handle(r1))

r2 = Request("bob", None, 50, {})
print(auth.handle(r2))`,
      java: `class HttpRequest {
    String user, token, body; int rateLimitCount;
    HttpRequest(String user, String token, int count, String body) {
        this.user=user; this.token=token; this.rateLimitCount=count; this.body=body;
    }
}

abstract class RequestHandler {
    private RequestHandler next;
    public RequestHandler setNext(RequestHandler next) { this.next = next; return next; }
    public String handle(HttpRequest req) {
        if (next != null) return next.handle(req);
        return null;
    }
}

class AuthHandler extends RequestHandler {
    public String handle(HttpRequest req) {
        if (req.token == null) return "401 Unauthorized: No token provided";
        if (!req.token.equals("valid_token")) return "403 Forbidden: Invalid token";
        System.out.println("[Auth] User '" + req.user + "' authenticated");
        return super.handle(req);
    }
}

class RateLimitHandler extends RequestHandler {
    private int maxRequests;
    RateLimitHandler(int max) { this.maxRequests = max; }
    public String handle(HttpRequest req) {
        if (req.rateLimitCount > maxRequests) return "429 Too Many Requests";
        System.out.println("[Rate] " + req.rateLimitCount + "/" + maxRequests + " - OK");
        return super.handle(req);
    }
}

class ValidationHandler extends RequestHandler {
    public String handle(HttpRequest req) {
        if (req.body == null || req.body.isEmpty()) return "400 Bad Request: Empty body";
        System.out.println("[Validation] Body valid: " + req.body);
        return super.handle(req);
    }
}

class BusinessLogicHandler extends RequestHandler {
    public String handle(HttpRequest req) {
        System.out.println("[Business] Processing request from '" + req.user + "'");
        return "200 OK: Request processed successfully";
    }
}

class Main {
    public static void main(String[] args) {
        AuthHandler auth = new AuthHandler();
        auth.setNext(new RateLimitHandler(100)).setNext(new ValidationHandler()).setNext(new BusinessLogicHandler());
        System.out.println(auth.handle(new HttpRequest("alice", "valid_token", 50, "buy")));
        System.out.println(auth.handle(new HttpRequest("bob", null, 50, "buy")));
    }
}`,
      cpp: `#include <iostream>
#include <string>
using namespace std;

struct HttpRequest {
    string user, token, body;
    int rateLimitCount;
};

class RequestHandler {
protected:
    RequestHandler* next = nullptr;
public:
    RequestHandler* setNext(RequestHandler* n) { next = n; return n; }
    virtual string handle(const HttpRequest& req) {
        if (next) return next->handle(req);
        return "";
    }
    virtual ~RequestHandler() = default;
};

class AuthHandler : public RequestHandler {
public:
    string handle(const HttpRequest& req) override {
        if (req.token.empty()) return "401 Unauthorized: No token provided";
        if (req.token != "valid_token") return "403 Forbidden: Invalid token";
        cout << "[Auth] User '" << req.user << "' authenticated\n";
        return RequestHandler::handle(req);
    }
};

class RateLimitHandler : public RequestHandler {
    int maxRequests;
public:
    RateLimitHandler(int max) : maxRequests(max) {}
    string handle(const HttpRequest& req) override {
        if (req.rateLimitCount > maxRequests) return "429 Too Many Requests";
        cout << "[Rate] " << req.rateLimitCount << "/" << maxRequests << " - OK\n";
        return RequestHandler::handle(req);
    }
};

class ValidationHandler : public RequestHandler {
public:
    string handle(const HttpRequest& req) override {
        if (req.body.empty()) return "400 Bad Request: Empty body";
        cout << "[Validation] Body valid: " << req.body << "\n";
        return RequestHandler::handle(req);
    }
};

class BusinessLogicHandler : public RequestHandler {
public:
    string handle(const HttpRequest& req) override {
        cout << "[Business] Processing request from '" << req.user << "'\n";
        return "200 OK: Request processed successfully";
    }
};

int main() {
    AuthHandler auth; RateLimitHandler rate(100);
    ValidationHandler validation; BusinessLogicHandler business;
    auth.setNext(&rate)->setNext(&validation)->setNext(&business);
    cout << auth.handle({"alice", "valid_token", "", 50}) << "\n";
    cout << auth.handle({"bob", "", "buy", 50}) << "\n";
}`,
      typescript: `interface HttpRequest {
  user: string;
  token: string | null;
  rateLimitCount: number;
  body: Record<string, unknown>;
}

abstract class RequestHandler {
  private next: RequestHandler | null = null;

  setNext(handler: RequestHandler): RequestHandler {
    this.next = handler;
    return handler;
  }

  handle(request: HttpRequest): string | null {
    if (this.next) return this.next.handle(request);
    return null;
  }
}

class AuthHandler extends RequestHandler {
  handle(request: HttpRequest): string | null {
    if (!request.token) return '401 Unauthorized: No token provided';
    if (request.token !== 'valid_token') return '403 Forbidden: Invalid token';
    console.log(\`[Auth] User '\${request.user}' authenticated\`);
    return super.handle(request);
  }
}

class RateLimitHandler extends RequestHandler {
  constructor(private maxRequests: number) { super(); }
  handle(request: HttpRequest): string | null {
    if (request.rateLimitCount > this.maxRequests) return \`429 Too Many Requests\`;
    console.log(\`[Rate] \${request.rateLimitCount}/\${this.maxRequests} - OK\`);
    return super.handle(request);
  }
}

class ValidationHandler extends RequestHandler {
  handle(request: HttpRequest): string | null {
    if (!request.body || Object.keys(request.body).length === 0) return '400 Bad Request: Empty body';
    console.log(\`[Validation] Body valid\`);
    return super.handle(request);
  }
}

class BusinessLogicHandler extends RequestHandler {
  handle(request: HttpRequest): string | null {
    console.log(\`[Business] Processing request from '\${request.user}'\`);
    return '200 OK: Request processed successfully';
  }
}

const auth = new AuthHandler();
auth.setNext(new RateLimitHandler(100)).setNext(new ValidationHandler()).setNext(new BusinessLogicHandler());
console.log(auth.handle({ user: 'alice', token: 'valid_token', rateLimitCount: 50, body: { action: 'buy' } }));
console.log(auth.handle({ user: 'bob', token: null, rateLimitCount: 50, body: {} }));`,
    },
    decisionGuide: {
      goodFitSignals: [
        'Multiple handlers may process a request and I don\'t know which one(s) at compile time',
        'I want to decouple the sender of a request from its receivers',
        'The set of handlers and their order needs to change dynamically at runtime',
        'I have a pipeline of middleware, filters, or validators where each step decides to handle or pass on',
      ],
      useWhen: [
        'More than one object may handle a request and the handler is not known a priori',
        'You want to issue a request to one of several objects without specifying the receiver explicitly',
        'The set of handlers should be configurable at runtime (e.g., middleware pipelines)',
      ],
      avoidWhen: [
        'Every request must be handled — a chain can silently drop requests if no handler matches',
        'The chain is always the same two handlers — a simple if/else is clearer',
        'Performance is critical and chaining adds overhead that is not justified',
      ],
      complexity: 'Medium',
      alternatives: [
        {
          slug: 'decorator',
          name: 'Decorator',
          reason: 'Use Decorator when every handler in the chain must always process the request (wrapping, not routing)',
        },
        {
          slug: 'strategy',
          name: 'Strategy',
          reason: 'Use Strategy when exactly one handler processes the request and it is selected up front',
        },
        {
          slug: 'command',
          name: 'Command',
          reason: 'Use Command when you need undoable, queueable actions, not a request routing pipeline',
        },
      ],
      bottomLine: 'Chain of Responsibility is the pattern for middleware, interceptor, and filter pipelines — use it when a request should flow through a configurable sequence of handlers.',
    },
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
    code: {
      python: `from abc import ABC, abstractmethod
from typing import List
import math


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


class AreaCalculator(ShapeVisitor):
    def visit_circle(self, c: Circle) -> float: return math.pi * c.radius ** 2
    def visit_rectangle(self, r: Rectangle) -> float: return r.width * r.height
    def visit_triangle(self, t: Triangle) -> float: return 0.5 * t.base * t.height


class PerimeterCalculator(ShapeVisitor):
    def visit_circle(self, c: Circle) -> float: return 2 * math.pi * c.radius
    def visit_rectangle(self, r: Rectangle) -> float: return 2 * (r.width + r.height)
    def visit_triangle(self, t: Triangle) -> float:
        hyp = math.sqrt(t.base**2 + t.height**2)
        return t.base + t.height + hyp


shapes: List[Shape] = [Circle(5), Rectangle(4, 6), Triangle(3, 4)]
area_calc = AreaCalculator()
perim_calc = PerimeterCalculator()

for shape in shapes:
    name = type(shape).__name__
    area = shape.accept(area_calc)
    perim = shape.accept(perim_calc)
    print(f"{name}: area={area:.2f}, perimeter={perim:.2f}")`,
      java: `interface ShapeVisitor {
    double visitCircle(Circle c);
    double visitRectangle(Rectangle r);
    double visitTriangle(Triangle t);
}

interface Shape { double accept(ShapeVisitor v); }

class Circle implements Shape {
    double radius;
    Circle(double r) { radius = r; }
    public double accept(ShapeVisitor v) { return v.visitCircle(this); }
}

class Rectangle implements Shape {
    double width, height;
    Rectangle(double w, double h) { width=w; height=h; }
    public double accept(ShapeVisitor v) { return v.visitRectangle(this); }
}

class Triangle implements Shape {
    double base, height;
    Triangle(double b, double h) { base=b; height=h; }
    public double accept(ShapeVisitor v) { return v.visitTriangle(this); }
}

class AreaCalculator implements ShapeVisitor {
    public double visitCircle(Circle c) { return Math.PI * c.radius * c.radius; }
    public double visitRectangle(Rectangle r) { return r.width * r.height; }
    public double visitTriangle(Triangle t) { return 0.5 * t.base * t.height; }
}

class PerimeterCalculator implements ShapeVisitor {
    public double visitCircle(Circle c) { return 2 * Math.PI * c.radius; }
    public double visitRectangle(Rectangle r) { return 2 * (r.width + r.height); }
    public double visitTriangle(Triangle t) {
        return t.base + t.height + Math.sqrt(t.base*t.base + t.height*t.height);
    }
}

class Main {
    public static void main(String[] args) {
        Shape[] shapes = { new Circle(5), new Rectangle(4, 6), new Triangle(3, 4) };
        AreaCalculator area = new AreaCalculator();
        PerimeterCalculator perim = new PerimeterCalculator();
        for (Shape s : shapes) {
            System.out.printf("%s: area=%.2f, perimeter=%.2f%n",
                s.getClass().getSimpleName(), s.accept(area), s.accept(perim));
        }
    }
}`,
      cpp: `#include <iostream>
#include <cmath>
using namespace std;

class Circle; class Rectangle; class Triangle;

class ShapeVisitor {
public:
    virtual double visitCircle(const Circle& c) = 0;
    virtual double visitRectangle(const Rectangle& r) = 0;
    virtual double visitTriangle(const Triangle& t) = 0;
    virtual ~ShapeVisitor() = default;
};

class Shape {
public:
    virtual double accept(ShapeVisitor& v) const = 0;
    virtual ~Shape() = default;
};

class Circle : public Shape {
public:
    double radius;
    Circle(double r) : radius(r) {}
    double accept(ShapeVisitor& v) const override { return v.visitCircle(*this); }
};

class Rectangle : public Shape {
public:
    double width, height;
    Rectangle(double w, double h) : width(w), height(h) {}
    double accept(ShapeVisitor& v) const override { return v.visitRectangle(*this); }
};

class Triangle : public Shape {
public:
    double base, height;
    Triangle(double b, double h) : base(b), height(h) {}
    double accept(ShapeVisitor& v) const override { return v.visitTriangle(*this); }
};

class AreaCalculator : public ShapeVisitor {
public:
    double visitCircle(const Circle& c) override { return M_PI * c.radius * c.radius; }
    double visitRectangle(const Rectangle& r) override { return r.width * r.height; }
    double visitTriangle(const Triangle& t) override { return 0.5 * t.base * t.height; }
};

class PerimeterCalculator : public ShapeVisitor {
public:
    double visitCircle(const Circle& c) override { return 2 * M_PI * c.radius; }
    double visitRectangle(const Rectangle& r) override { return 2 * (r.width + r.height); }
    double visitTriangle(const Triangle& t) override {
        return t.base + t.height + sqrt(t.base*t.base + t.height*t.height);
    }
};

int main() {
    Circle c(5); Rectangle r(4,6); Triangle t(3,4);
    AreaCalculator area; PerimeterCalculator perim;
    Shape* shapes[] = {&c, &r, &t};
    for (auto* s : shapes) {
        cout.precision(2); cout << fixed;
        cout << "area=" << s->accept(area) << ", perimeter=" << s->accept(perim) << "\n";
    }
}`,
      typescript: `interface ShapeVisitor {
  visitCircle(c: Circle): number;
  visitRectangle(r: Rectangle): number;
  visitTriangle(t: Triangle): number;
}

interface Shape { accept(v: ShapeVisitor): number; }

class Circle implements Shape {
  constructor(public radius: number) {}
  accept(v: ShapeVisitor): number { return v.visitCircle(this); }
}

class Rectangle implements Shape {
  constructor(public width: number, public height: number) {}
  accept(v: ShapeVisitor): number { return v.visitRectangle(this); }
}

class Triangle implements Shape {
  constructor(public base: number, public height: number) {}
  accept(v: ShapeVisitor): number { return v.visitTriangle(this); }
}

class AreaCalculator implements ShapeVisitor {
  visitCircle(c: Circle): number { return Math.PI * c.radius ** 2; }
  visitRectangle(r: Rectangle): number { return r.width * r.height; }
  visitTriangle(t: Triangle): number { return 0.5 * t.base * t.height; }
}

class PerimeterCalculator implements ShapeVisitor {
  visitCircle(c: Circle): number { return 2 * Math.PI * c.radius; }
  visitRectangle(r: Rectangle): number { return 2 * (r.width + r.height); }
  visitTriangle(t: Triangle): number {
    return t.base + t.height + Math.sqrt(t.base ** 2 + t.height ** 2);
  }
}

const shapes: Shape[] = [new Circle(5), new Rectangle(4, 6), new Triangle(3, 4)];
const area = new AreaCalculator();
const perim = new PerimeterCalculator();

shapes.forEach(shape => {
  console.log(\`\${shape.constructor.name}: area=\${shape.accept(area).toFixed(2)}, perimeter=\${shape.accept(perim).toFixed(2)}\`);
});`,
    },
    decisionGuide: {
      goodFitSignals: [
        'I need to add many unrelated operations to an object structure without changing the element classes',
        'An object structure contains many classes with differing interfaces and I want to perform type-specific operations',
        'Operations on the structure change frequently but the structure itself is stable',
        'I want to accumulate state while traversing a complex structure (compilers, interpreters, serialisers)',
      ],
      useWhen: [
        'An object structure is stable but you often need to define new operations on it',
        'Many distinct and unrelated operations need to be performed on an object structure without polluting classes',
        'You want to gather related operations into one visitor class rather than spread them across many classes',
      ],
      avoidWhen: [
        'New element classes are added frequently — every new element requires changing all visitors',
        'The structure is not stable — use Strategy or polymorphism if elements evolve rapidly',
        'Access to private state of elements is needed and you cannot add an accept() method',
      ],
      complexity: 'High',
      alternatives: [
        {
          slug: 'strategy',
          name: 'Strategy',
          reason: 'Use Strategy when a single object needs swappable behaviour rather than applying one operation across many types',
        },
        {
          slug: 'iterator',
          name: 'Iterator',
          reason: 'Use Iterator when you need to traverse the structure uniformly without type-specific dispatch',
        },
        {
          slug: 'decorator',
          name: 'Decorator',
          reason: 'Use Decorator when you add behaviour to individual objects rather than operating across a whole structure',
        },
      ],
      bottomLine: 'Visitor is ideal when you have a stable class hierarchy but frequently add new operations — if the hierarchy changes often, the cost of updating all visitors outweighs the benefit.',
    },
  },
];

export function getPatternBySlug(slug: string): Pattern | undefined {
  return patterns.find((p) => p.slug === slug);
}

export function getPatternsByCategory(category: string): Pattern[] {
  if (category === 'All') return patterns;
  return patterns.filter((p) => p.category === category);
}
