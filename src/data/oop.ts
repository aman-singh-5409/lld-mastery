export interface MultiLangCode {
  python: string;
  java: string;
  cpp: string;
  typescript: string;
}

export interface OOPConcept {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  keyPoints: string[];
  code: MultiLangCode;
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
    code: {
      python: `class BankAccount:
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
        return self.__transactions.copy()


account = BankAccount("ACC-001", 1000)
account.deposit(500)
account.withdraw(200)
print(f"Balance: {account.balance:.2f}")`,

      java: `import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class BankAccount {
    private final String accountId;
    private double balance;
    private final List<String> transactions = new ArrayList<>();

    public BankAccount(String accountId, double initialBalance) {
        this.accountId = accountId;
        this.balance = initialBalance;
    }

    public String getAccountId() { return accountId; }
    public double getBalance() { return balance; }

    public void deposit(double amount) {
        if (amount <= 0) throw new IllegalArgumentException("Deposit must be positive");
        balance += amount;
        transactions.add("deposit: " + amount);
        System.out.printf("Deposited %.2f. New balance: %.2f%n", amount, balance);
    }

    public void withdraw(double amount) {
        if (amount <= 0) throw new IllegalArgumentException("Withdrawal must be positive");
        if (amount > balance) throw new IllegalStateException("Insufficient funds");
        balance -= amount;
        transactions.add("withdrawal: " + amount);
        System.out.printf("Withdrew %.2f. New balance: %.2f%n", amount, balance);
    }

    public List<String> getStatement() {
        return Collections.unmodifiableList(transactions);
    }

    public static void main(String[] args) {
        BankAccount account = new BankAccount("ACC-001", 1000);
        account.deposit(500);
        account.withdraw(200);
        System.out.printf("Balance: %.2f%n", account.getBalance());
    }
}`,

      cpp: `#include <iostream>
#include <vector>
#include <string>
#include <stdexcept>

class BankAccount {
private:
    std::string accountId;
    double balance;
    std::vector<std::string> transactions;

public:
    BankAccount(const std::string& id, double initialBalance)
        : accountId(id), balance(initialBalance) {}

    std::string getAccountId() const { return accountId; }
    double getBalance() const { return balance; }

    void deposit(double amount) {
        if (amount <= 0) throw std::invalid_argument("Deposit must be positive");
        balance += amount;
        transactions.push_back("deposit: " + std::to_string(amount));
        std::cout << "Deposited " << amount << ". New balance: " << balance << std::endl;
    }

    void withdraw(double amount) {
        if (amount <= 0) throw std::invalid_argument("Withdrawal must be positive");
        if (amount > balance) throw std::runtime_error("Insufficient funds");
        balance -= amount;
        transactions.push_back("withdrawal: " + std::to_string(amount));
        std::cout << "Withdrew " << amount << ". New balance: " << balance << std::endl;
    }

    const std::vector<std::string>& getStatement() const {
        return transactions;
    }
};

int main() {
    BankAccount account("ACC-001", 1000);
    account.deposit(500);
    account.withdraw(200);
    std::cout << "Balance: " << account.getBalance() << std::endl;
    return 0;
}`,

      typescript: `class BankAccount {
  private readonly accountId: string;
  private balance: number;
  private readonly transactions: string[] = [];

  constructor(accountId: string, initialBalance: number = 0) {
    this.accountId = accountId;
    this.balance = initialBalance;
  }

  getAccountId(): string { return this.accountId; }
  getBalance(): number { return this.balance; }

  deposit(amount: number): void {
    if (amount <= 0) throw new Error("Deposit amount must be positive");
    this.balance += amount;
    this.transactions.push(\`deposit: \${amount}\`);
    console.log(\`Deposited \${amount.toFixed(2)}. New balance: \${this.balance.toFixed(2)}\`);
  }

  withdraw(amount: number): void {
    if (amount <= 0) throw new Error("Withdrawal amount must be positive");
    if (amount > this.balance) throw new Error("Insufficient funds");
    this.balance -= amount;
    this.transactions.push(\`withdrawal: \${amount}\`);
    console.log(\`Withdrew \${amount.toFixed(2)}. New balance: \${this.balance.toFixed(2)}\`);
  }

  getStatement(): readonly string[] {
    return [...this.transactions];
  }
}

const account = new BankAccount("ACC-001", 1000);
account.deposit(500);
account.withdraw(200);
console.log(\`Balance: \${account.getBalance().toFixed(2)}\`);`,
    },
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
    code: {
      python: `from abc import ABC, abstractmethod


class Animal(ABC):
    def __init__(self, name: str, age: int):
        self.name = name
        self.age = age

    @abstractmethod
    def speak(self) -> str:
        pass

    def breathe(self) -> str:
        return f"{self.name} breathes air"

    def __str__(self) -> str:
        return f"{type(self).__name__}(name={self.name}, age={self.age})"


class Dog(Animal):
    def __init__(self, name: str, age: int, breed: str):
        super().__init__(name, age)
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


class GuideDog(Dog):
    def __init__(self, name: str, age: int, breed: str, owner: str):
        super().__init__(name, age, breed)
        self.owner = owner

    def guide(self) -> str:
        return f"{self.name} guides {self.owner} safely"


dog = Dog("Rex", 3, "Labrador")
cat = Cat("Whiskers", 5)
guide = GuideDog("Buddy", 4, "Golden Retriever", "John")

for animal in [dog, cat, guide]:
    print(animal)
    print(f"  - {animal.speak()}")`,

      java: `abstract class Animal {
    protected String name;
    protected int age;

    public Animal(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public abstract String speak();

    public String breathe() {
        return name + " breathes air";
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + "(name=" + name + ", age=" + age + ")";
    }
}

class Dog extends Animal {
    private String breed;

    public Dog(String name, int age, String breed) {
        super(name, age);
        this.breed = breed;
    }

    @Override
    public String speak() { return name + " says: Woof!"; }

    public String fetch() { return name + " fetches the ball!"; }
}

class Cat extends Animal {
    public Cat(String name, int age) { super(name, age); }

    @Override
    public String speak() { return name + " says: Meow!"; }
}

class GuideDog extends Dog {
    private String owner;

    public GuideDog(String name, int age, String breed, String owner) {
        super(name, age, breed);
        this.owner = owner;
    }

    public String guide() { return name + " guides " + owner + " safely"; }
}

public class InheritanceDemo {
    public static void main(String[] args) {
        Animal[] animals = {
            new Dog("Rex", 3, "Labrador"),
            new Cat("Whiskers", 5),
            new GuideDog("Buddy", 4, "Golden Retriever", "John")
        };
        for (Animal a : animals) {
            System.out.println(a);
            System.out.println("  - " + a.speak());
        }
    }
}`,

      cpp: `#include <iostream>
#include <string>

class Animal {
protected:
    std::string name;
    int age;
public:
    Animal(const std::string& name, int age) : name(name), age(age) {}
    virtual ~Animal() = default;
    virtual std::string speak() const = 0;
    std::string breathe() const { return name + " breathes air"; }
    virtual std::string toString() const {
        return "Animal(name=" + name + ", age=" + std::to_string(age) + ")";
    }
};

class Dog : public Animal {
    std::string breed;
public:
    Dog(const std::string& n, int age, const std::string& breed)
        : Animal(n, age), breed(breed) {}
    std::string speak() const override { return name + " says: Woof!"; }
    std::string fetch() const { return name + " fetches the ball!"; }
};

class Cat : public Animal {
public:
    Cat(const std::string& n, int age) : Animal(n, age) {}
    std::string speak() const override { return name + " says: Meow!"; }
};

class GuideDog : public Dog {
    std::string owner;
public:
    GuideDog(const std::string& n, int age, const std::string& breed, const std::string& owner)
        : Dog(n, age, breed), owner(owner) {}
    std::string guide() const { return name + " guides " + owner + " safely"; }
};

int main() {
    Dog dog("Rex", 3, "Labrador");
    Cat cat("Whiskers", 5);
    GuideDog guide("Buddy", 4, "Golden Retriever", "John");

    Animal* animals[] = {&dog, &cat, &guide};
    for (Animal* a : animals) {
        std::cout << a->toString() << std::endl;
        std::cout << "  - " << a->speak() << std::endl;
    }
    return 0;
}`,

      typescript: `abstract class Animal {
  constructor(protected name: string, protected age: number) {}

  abstract speak(): string;

  breathe(): string { return \`\${this.name} breathes air\`; }

  toString(): string {
    return \`\${this.constructor.name}(name=\${this.name}, age=\${this.age})\`;
  }
}

class Dog extends Animal {
  constructor(name: string, age: number, private breed: string) {
    super(name, age);
  }
  speak(): string { return \`\${this.name} says: Woof!\`; }
  fetch(): string { return \`\${this.name} fetches the ball!\`; }
}

class Cat extends Animal {
  speak(): string { return \`\${this.name} says: Meow!\`; }
}

class GuideDog extends Dog {
  constructor(name: string, age: number, breed: string, private owner: string) {
    super(name, age, breed);
  }
  guide(): string { return \`\${this.name} guides \${this.owner} safely\`; }
}

const animals: Animal[] = [
  new Dog("Rex", 3, "Labrador"),
  new Cat("Whiskers", 5),
  new GuideDog("Buddy", 4, "Golden Retriever", "John"),
];

for (const animal of animals) {
  console.log(animal.toString());
  console.log("  -", animal.speak());
}`,
    },
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
    code: {
      python: `from abc import ABC, abstractmethod
from typing import List
import math


class Shape(ABC):
    @abstractmethod
    def area(self) -> float: pass

    @abstractmethod
    def perimeter(self) -> float: pass

    def describe(self) -> str:
        return (f"{type(self).__name__}: "
                f"area={self.area():.2f}, "
                f"perimeter={self.perimeter():.2f}")


class Circle(Shape):
    def __init__(self, radius: float):
        self.radius = radius

    def area(self) -> float: return math.pi * self.radius ** 2
    def perimeter(self) -> float: return 2 * math.pi * self.radius


class Rectangle(Shape):
    def __init__(self, width: float, height: float):
        self.width = width
        self.height = height

    def area(self) -> float: return self.width * self.height
    def perimeter(self) -> float: return 2 * (self.width + self.height)


def total_area(shapes: List[Shape]) -> float:
    return sum(shape.area() for shape in shapes)


shapes: List[Shape] = [Circle(5), Rectangle(4, 6)]
for shape in shapes:
    print(shape.describe())
print(f"Total area: {total_area(shapes):.2f}")`,

      java: `import java.util.List;

abstract class Shape {
    public abstract double area();
    public abstract double perimeter();
    public String describe() {
        return String.format("%s: area=%.2f, perimeter=%.2f",
            getClass().getSimpleName(), area(), perimeter());
    }
}

class Circle extends Shape {
    private double radius;
    Circle(double radius) { this.radius = radius; }
    public double area() { return Math.PI * radius * radius; }
    public double perimeter() { return 2 * Math.PI * radius; }
}

class Rectangle extends Shape {
    private double width, height;
    Rectangle(double w, double h) { width = w; height = h; }
    public double area() { return width * height; }
    public double perimeter() { return 2 * (width + height); }
}

public class PolymorphismDemo {
    static double totalArea(List<Shape> shapes) {
        return shapes.stream().mapToDouble(Shape::area).sum();
    }

    public static void main(String[] args) {
        List<Shape> shapes = List.of(new Circle(5), new Rectangle(4, 6));
        shapes.forEach(s -> System.out.println(s.describe()));
        System.out.printf("Total area: %.2f%n", totalArea(shapes));
    }
}`,

      cpp: `#include <iostream>
#include <vector>
#include <cmath>
#include <numeric>

class Shape {
public:
    virtual ~Shape() = default;
    virtual double area() const = 0;
    virtual double perimeter() const = 0;
    std::string describe() const {
        return std::string(typeid(*this).name()) +
               ": area=" + std::to_string(area()) +
               ", perimeter=" + std::to_string(perimeter());
    }
};

class Circle : public Shape {
    double radius;
public:
    explicit Circle(double r) : radius(r) {}
    double area() const override { return M_PI * radius * radius; }
    double perimeter() const override { return 2 * M_PI * radius; }
};

class Rectangle : public Shape {
    double width, height;
public:
    Rectangle(double w, double h) : width(w), height(h) {}
    double area() const override { return width * height; }
    double perimeter() const override { return 2 * (width + height); }
};

int main() {
    std::vector<Shape*> shapes = {new Circle(5), new Rectangle(4, 6)};
    double total = 0;
    for (auto* s : shapes) {
        std::cout << s->describe() << std::endl;
        total += s->area();
    }
    std::cout << "Total area: " << total << std::endl;
    for (auto* s : shapes) delete s;
    return 0;
}`,

      typescript: `abstract class Shape {
  abstract area(): number;
  abstract perimeter(): number;
  describe(): string {
    return \`\${this.constructor.name}: area=\${this.area().toFixed(2)}, perimeter=\${this.perimeter().toFixed(2)}\`;
  }
}

class Circle extends Shape {
  constructor(private radius: number) { super(); }
  area(): number { return Math.PI * this.radius ** 2; }
  perimeter(): number { return 2 * Math.PI * this.radius; }
}

class Rectangle extends Shape {
  constructor(private width: number, private height: number) { super(); }
  area(): number { return this.width * this.height; }
  perimeter(): number { return 2 * (this.width + this.height); }
}

function totalArea(shapes: Shape[]): number {
  return shapes.reduce((sum, s) => sum + s.area(), 0);
}

const shapes: Shape[] = [new Circle(5), new Rectangle(4, 6)];
shapes.forEach(s => console.log(s.describe()));
console.log(\`Total area: \${totalArea(shapes).toFixed(2)}\`);`,
    },
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
    code: {
      python: `from abc import ABC, abstractmethod


class PaymentGateway(ABC):
    @abstractmethod
    def charge(self, amount: float, currency: str) -> bool: pass

    @abstractmethod
    def refund(self, transaction_id: str, amount: float) -> bool: pass

    @abstractmethod
    def get_balance(self) -> float: pass


class StripeGateway(PaymentGateway):
    def charge(self, amount: float, currency: str) -> bool:
        print(f"[Stripe] Charging {amount:.2f} {currency}")
        return True

    def refund(self, transaction_id: str, amount: float) -> bool:
        print(f"[Stripe] Refunding {amount:.2f} for {transaction_id}")
        return True

    def get_balance(self) -> float:
        return 10000.00


class PayPalGateway(PaymentGateway):
    def charge(self, amount: float, currency: str) -> bool:
        print(f"[PayPal] Processing payment of {amount:.2f} {currency}")
        return True

    def refund(self, transaction_id: str, amount: float) -> bool:
        print(f"[PayPal] Initiating refund for {transaction_id}")
        return True

    def get_balance(self) -> float:
        return 5000.00


class OrderPaymentService:
    def __init__(self, gateway: PaymentGateway):
        self._gateway = gateway

    def process_order(self, order_id: str, amount: float) -> bool:
        success = self._gateway.charge(amount, "USD")
        if success:
            print(f"Order {order_id} payment successful!")
        return success


stripe_service = OrderPaymentService(StripeGateway())
stripe_service.process_order("ORD-001", 99.99)

paypal_service = OrderPaymentService(PayPalGateway())
paypal_service.process_order("ORD-002", 149.99)`,

      java: `interface PaymentGateway {
    boolean charge(double amount, String currency);
    boolean refund(String transactionId, double amount);
    double getBalance();
}

class StripeGateway implements PaymentGateway {
    public boolean charge(double amount, String currency) {
        System.out.printf("[Stripe] Charging %.2f %s%n", amount, currency);
        return true;
    }
    public boolean refund(String txId, double amount) {
        System.out.printf("[Stripe] Refunding %.2f for %s%n", amount, txId);
        return true;
    }
    public double getBalance() { return 10000.0; }
}

class PayPalGateway implements PaymentGateway {
    public boolean charge(double amount, String currency) {
        System.out.printf("[PayPal] Processing %.2f %s%n", amount, currency);
        return true;
    }
    public boolean refund(String txId, double amount) {
        System.out.printf("[PayPal] Initiating refund for %s%n", txId);
        return true;
    }
    public double getBalance() { return 5000.0; }
}

class OrderPaymentService {
    private final PaymentGateway gateway;

    public OrderPaymentService(PaymentGateway gateway) {
        this.gateway = gateway;
    }

    public boolean processOrder(String orderId, double amount) {
        boolean success = gateway.charge(amount, "USD");
        if (success) System.out.println("Order " + orderId + " payment successful!");
        return success;
    }

    public static void main(String[] args) {
        new OrderPaymentService(new StripeGateway()).processOrder("ORD-001", 99.99);
        new OrderPaymentService(new PayPalGateway()).processOrder("ORD-002", 149.99);
    }
}`,

      cpp: `#include <iostream>
#include <string>

class PaymentGateway {
public:
    virtual ~PaymentGateway() = default;
    virtual bool charge(double amount, const std::string& currency) = 0;
    virtual bool refund(const std::string& txId, double amount) = 0;
    virtual double getBalance() = 0;
};

class StripeGateway : public PaymentGateway {
public:
    bool charge(double amount, const std::string& currency) override {
        std::cout << "[Stripe] Charging " << amount << " " << currency << std::endl;
        return true;
    }
    bool refund(const std::string& txId, double amount) override {
        std::cout << "[Stripe] Refunding " << amount << " for " << txId << std::endl;
        return true;
    }
    double getBalance() override { return 10000.0; }
};

class PayPalGateway : public PaymentGateway {
public:
    bool charge(double amount, const std::string& currency) override {
        std::cout << "[PayPal] Processing " << amount << " " << currency << std::endl;
        return true;
    }
    bool refund(const std::string& txId, double amount) override {
        std::cout << "[PayPal] Initiating refund for " << txId << std::endl;
        return true;
    }
    double getBalance() override { return 5000.0; }
};

class OrderPaymentService {
    PaymentGateway& gateway;
public:
    explicit OrderPaymentService(PaymentGateway& gw) : gateway(gw) {}
    bool processOrder(const std::string& orderId, double amount) {
        bool success = gateway.charge(amount, "USD");
        if (success) std::cout << "Order " << orderId << " payment successful!" << std::endl;
        return success;
    }
};

int main() {
    StripeGateway stripe;
    PayPalGateway paypal;
    OrderPaymentService(stripe).processOrder("ORD-001", 99.99);
    OrderPaymentService(paypal).processOrder("ORD-002", 149.99);
    return 0;
}`,

      typescript: `interface PaymentGateway {
  charge(amount: number, currency: string): boolean;
  refund(transactionId: string, amount: number): boolean;
  getBalance(): number;
}

class StripeGateway implements PaymentGateway {
  charge(amount: number, currency: string): boolean {
    console.log(\`[Stripe] Charging \${amount.toFixed(2)} \${currency}\`);
    return true;
  }
  refund(txId: string, amount: number): boolean {
    console.log(\`[Stripe] Refunding \${amount.toFixed(2)} for \${txId}\`);
    return true;
  }
  getBalance(): number { return 10000; }
}

class PayPalGateway implements PaymentGateway {
  charge(amount: number, currency: string): boolean {
    console.log(\`[PayPal] Processing \${amount.toFixed(2)} \${currency}\`);
    return true;
  }
  refund(txId: string, amount: number): boolean {
    console.log(\`[PayPal] Initiating refund for \${txId}\`);
    return true;
  }
  getBalance(): number { return 5000; }
}

class OrderPaymentService {
  constructor(private gateway: PaymentGateway) {}

  processOrder(orderId: string, amount: number): boolean {
    const success = this.gateway.charge(amount, "USD");
    if (success) console.log(\`Order \${orderId} payment successful!\`);
    return success;
  }
}

new OrderPaymentService(new StripeGateway()).processOrder("ORD-001", 99.99);
new OrderPaymentService(new PayPalGateway()).processOrder("ORD-002", 149.99);`,
    },
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
    code: {
      python: `from abc import ABC, abstractmethod

# S - Single Responsibility
class UserRepository:
    def save(self, user: dict) -> bool:
        print(f"Saving user: {user['name']}")
        return True

class EmailService:
    def send_welcome_email(self, email: str) -> bool:
        print(f"Sending welcome email to: {email}")
        return True

class UserRegistrationService:
    def __init__(self, repo: UserRepository, email: EmailService):
        self.repo = repo
        self.email = email

    def register(self, name: str, email: str) -> bool:
        user = {"name": name, "email": email}
        if self.repo.save(user):
            self.email.send_welcome_email(email)
            return True
        return False


# O - Open/Closed
class Discount(ABC):
    @abstractmethod
    def apply(self, price: float) -> float: pass

class PercentageDiscount(Discount):
    def __init__(self, percent: float): self.percent = percent
    def apply(self, price: float) -> float:
        return price * (1 - self.percent / 100)

class SeasonalDiscount(Discount):
    def apply(self, price: float) -> float: return price * 0.8


# D - Dependency Inversion
class Logger(ABC):
    @abstractmethod
    def log(self, message: str): pass

class ConsoleLogger(Logger):
    def log(self, message: str): print(f"[Console] {message}")

class OrderService:
    def __init__(self, logger: Logger):
        self.logger = logger

    def place_order(self, item: str):
        self.logger.log(f"Order placed: {item}")
        return True


# Usage
service = UserRegistrationService(UserRepository(), EmailService())
service.register("Alice", "alice@example.com")

order_svc = OrderService(ConsoleLogger())
order_svc.place_order("Laptop")`,

      java: `import java.util.List;

// S - Single Responsibility
class UserRepository {
    public boolean save(String name) {
        System.out.println("Saving user: " + name);
        return true;
    }
}

class EmailService {
    public boolean sendWelcomeEmail(String email) {
        System.out.println("Sending welcome email to: " + email);
        return true;
    }
}

class UserRegistrationService {
    private final UserRepository repo;
    private final EmailService emailSvc;

    UserRegistrationService(UserRepository r, EmailService e) { repo = r; emailSvc = e; }

    public boolean register(String name, String email) {
        if (repo.save(name)) { emailSvc.sendWelcomeEmail(email); return true; }
        return false;
    }
}

// O - Open/Closed
interface Discount {
    double apply(double price);
}

class PercentageDiscount implements Discount {
    private double percent;
    PercentageDiscount(double p) { percent = p; }
    public double apply(double price) { return price * (1 - percent / 100); }
}

// D - Dependency Inversion
interface Logger {
    void log(String message);
}

class ConsoleLogger implements Logger {
    public void log(String message) { System.out.println("[Console] " + message); }
}

class OrderService {
    private final Logger logger;
    OrderService(Logger l) { logger = l; }
    public void placeOrder(String item) { logger.log("Order placed: " + item); }

    public static void main(String[] args) {
        new UserRegistrationService(new UserRepository(), new EmailService())
            .register("Alice", "alice@example.com");
        new OrderService(new ConsoleLogger()).placeOrder("Laptop");
    }
}`,

      cpp: `#include <iostream>
#include <string>

// S - Single Responsibility
class UserRepository {
public:
    bool save(const std::string& name) {
        std::cout << "Saving user: " << name << std::endl;
        return true;
    }
};

class EmailService {
public:
    bool sendWelcomeEmail(const std::string& email) {
        std::cout << "Sending welcome email to: " << email << std::endl;
        return true;
    }
};

class UserRegistrationService {
    UserRepository& repo;
    EmailService& emailSvc;
public:
    UserRegistrationService(UserRepository& r, EmailService& e) : repo(r), emailSvc(e) {}
    bool registerUser(const std::string& name, const std::string& email) {
        if (repo.save(name)) { emailSvc.sendWelcomeEmail(email); return true; }
        return false;
    }
};

// D - Dependency Inversion
class Logger {
public:
    virtual ~Logger() = default;
    virtual void log(const std::string& msg) = 0;
};

class ConsoleLogger : public Logger {
public:
    void log(const std::string& msg) override {
        std::cout << "[Console] " << msg << std::endl;
    }
};

class OrderService {
    Logger& logger;
public:
    explicit OrderService(Logger& l) : logger(l) {}
    void placeOrder(const std::string& item) {
        logger.log("Order placed: " + item);
    }
};

int main() {
    UserRepository repo; EmailService email;
    UserRegistrationService(repo, email).registerUser("Alice", "alice@example.com");

    ConsoleLogger logger;
    OrderService(logger).placeOrder("Laptop");
    return 0;
}`,

      typescript: `// S - Single Responsibility
class UserRepository {
  save(name: string): boolean {
    console.log(\`Saving user: \${name}\`);
    return true;
  }
}

class EmailService {
  sendWelcomeEmail(email: string): boolean {
    console.log(\`Sending welcome email to: \${email}\`);
    return true;
  }
}

class UserRegistrationService {
  constructor(private repo: UserRepository, private emailSvc: EmailService) {}
  register(name: string, email: string): boolean {
    if (this.repo.save(name)) { this.emailSvc.sendWelcomeEmail(email); return true; }
    return false;
  }
}

// O - Open/Closed
interface Discount {
  apply(price: number): number;
}

class PercentageDiscount implements Discount {
  constructor(private percent: number) {}
  apply(price: number): number { return price * (1 - this.percent / 100); }
}

// D - Dependency Inversion
interface Logger {
  log(message: string): void;
}

class ConsoleLogger implements Logger {
  log(message: string): void { console.log(\`[Console] \${message}\`); }
}

class OrderService {
  constructor(private logger: Logger) {}
  placeOrder(item: string): void { this.logger.log(\`Order placed: \${item}\`); }
}

// Usage
new UserRegistrationService(new UserRepository(), new EmailService())
  .register("Alice", "alice@example.com");

new OrderService(new ConsoleLogger()).placeOrder("Laptop");`,
    },
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
    code: {
      python: `from abc import ABC, abstractmethod


class FlyBehavior(ABC):
    @abstractmethod
    def fly(self) -> str: pass

class SwimBehavior(ABC):
    @abstractmethod
    def swim(self) -> str: pass

class CanFly(FlyBehavior):
    def fly(self) -> str: return "Flying with wings!"

class CannotFly(FlyBehavior):
    def fly(self) -> str: return "Cannot fly"

class CanSwim(SwimBehavior):
    def swim(self) -> str: return "Swimming!"


class Duck:
    def __init__(self):
        self.fly_behavior: FlyBehavior = CanFly()
        self.swim_behavior: SwimBehavior = CanSwim()

    def perform_fly(self) -> str: return self.fly_behavior.fly()
    def perform_swim(self) -> str: return self.swim_behavior.swim()

    def set_fly_behavior(self, behavior: FlyBehavior):
        self.fly_behavior = behavior


class Penguin:
    def __init__(self):
        self.fly_behavior: FlyBehavior = CannotFly()
        self.swim_behavior: SwimBehavior = CanSwim()

    def perform_fly(self) -> str: return self.fly_behavior.fly()
    def perform_swim(self) -> str: return self.swim_behavior.swim()


duck = Duck()
print(duck.perform_fly())   # Flying with wings!
duck.set_fly_behavior(CannotFly())
print(duck.perform_fly())   # Cannot fly

penguin = Penguin()
print(penguin.perform_fly())  # Cannot fly
print(penguin.perform_swim()) # Swimming!`,

      java: `interface FlyBehavior {
    String fly();
}

interface SwimBehavior {
    String swim();
}

class CanFly implements FlyBehavior {
    public String fly() { return "Flying with wings!"; }
}

class CannotFly implements FlyBehavior {
    public String fly() { return "Cannot fly"; }
}

class CanSwim implements SwimBehavior {
    public String swim() { return "Swimming!"; }
}

class Duck {
    private FlyBehavior flyBehavior = new CanFly();
    private SwimBehavior swimBehavior = new CanSwim();

    public String performFly() { return flyBehavior.fly(); }
    public String performSwim() { return swimBehavior.swim(); }
    public void setFlyBehavior(FlyBehavior fb) { flyBehavior = fb; }
}

class Penguin {
    private FlyBehavior flyBehavior = new CannotFly();
    private SwimBehavior swimBehavior = new CanSwim();

    public String performFly() { return flyBehavior.fly(); }
    public String performSwim() { return swimBehavior.swim(); }
}

public class CompositionDemo {
    public static void main(String[] args) {
        Duck duck = new Duck();
        System.out.println(duck.performFly());  // Flying with wings!
        duck.setFlyBehavior(new CannotFly());
        System.out.println(duck.performFly());  // Cannot fly

        Penguin penguin = new Penguin();
        System.out.println(penguin.performFly());   // Cannot fly
        System.out.println(penguin.performSwim());  // Swimming!
    }
}`,

      cpp: `#include <iostream>
#include <memory>
#include <string>

struct FlyBehavior {
    virtual ~FlyBehavior() = default;
    virtual std::string fly() const = 0;
};

struct SwimBehavior {
    virtual ~SwimBehavior() = default;
    virtual std::string swim() const = 0;
};

struct CanFly : FlyBehavior {
    std::string fly() const override { return "Flying with wings!"; }
};

struct CannotFly : FlyBehavior {
    std::string fly() const override { return "Cannot fly"; }
};

struct CanSwim : SwimBehavior {
    std::string swim() const override { return "Swimming!"; }
};

class Duck {
    std::unique_ptr<FlyBehavior> flyBehavior{new CanFly()};
    std::unique_ptr<SwimBehavior> swimBehavior{new CanSwim()};
public:
    std::string performFly() const { return flyBehavior->fly(); }
    std::string performSwim() const { return swimBehavior->swim(); }
    void setFlyBehavior(std::unique_ptr<FlyBehavior> fb) { flyBehavior = std::move(fb); }
};

class Penguin {
    std::unique_ptr<FlyBehavior> flyBehavior{new CannotFly()};
    std::unique_ptr<SwimBehavior> swimBehavior{new CanSwim()};
public:
    std::string performFly() const { return flyBehavior->fly(); }
    std::string performSwim() const { return swimBehavior->swim(); }
};

int main() {
    Duck duck;
    std::cout << duck.performFly() << std::endl;
    duck.setFlyBehavior(std::make_unique<CannotFly>());
    std::cout << duck.performFly() << std::endl;

    Penguin penguin;
    std::cout << penguin.performFly() << std::endl;
    std::cout << penguin.performSwim() << std::endl;
    return 0;
}`,

      typescript: `interface FlyBehavior { fly(): string; }
interface SwimBehavior { swim(): string; }

class CanFly implements FlyBehavior { fly() { return "Flying with wings!"; } }
class CannotFly implements FlyBehavior { fly() { return "Cannot fly"; } }
class CanSwim implements SwimBehavior { swim() { return "Swimming!"; } }

class Duck {
  private flyBehavior: FlyBehavior = new CanFly();
  private swimBehavior: SwimBehavior = new CanSwim();

  performFly(): string { return this.flyBehavior.fly(); }
  performSwim(): string { return this.swimBehavior.swim(); }
  setFlyBehavior(fb: FlyBehavior): void { this.flyBehavior = fb; }
}

class Penguin {
  private flyBehavior: FlyBehavior = new CannotFly();
  private swimBehavior: SwimBehavior = new CanSwim();

  performFly(): string { return this.flyBehavior.fly(); }
  performSwim(): string { return this.swimBehavior.swim(); }
}

const duck = new Duck();
console.log(duck.performFly());   // Flying with wings!
duck.setFlyBehavior(new CannotFly());
console.log(duck.performFly());   // Cannot fly

const penguin = new Penguin();
console.log(penguin.performFly());   // Cannot fly
console.log(penguin.performSwim());  // Swimming!`,
    },
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
    code: {
      python: `from abc import ABC, abstractmethod


# Singleton (Creational)
class ConsoleLogger:
    _instance = None

    def __new__(cls):
        if not cls._instance:
            cls._instance = super().__new__(cls)
        return cls._instance

    def log(self, msg: str):
        print(f"[LOG] {msg}")


# Decorator (Structural)
class TimestampLogger:
    def __init__(self, logger):
        self._logger = logger

    def log(self, msg: str):
        from datetime import datetime
        self._logger.log(f"{datetime.now().isoformat()} - {msg}")


# Observer (Behavioral)
class EventSystem:
    def __init__(self, logger):
        self._logger = logger
        self._observers = []

    def subscribe(self, observer):
        self._observers.append(observer)

    def notify(self, event: str):
        self._logger.log(f"Event: {event}")
        for obs in self._observers:
            obs(event)


logger = TimestampLogger(ConsoleLogger())
events = EventSystem(logger)
events.subscribe(lambda e: print(f"Handler 1: {e}"))
events.subscribe(lambda e: print(f"Handler 2: {e}"))
events.notify("user_registered")`,

      java: `import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;

// Singleton (Creational)
class ConsoleLogger {
    private static ConsoleLogger instance;
    private ConsoleLogger() {}
    public static ConsoleLogger getInstance() {
        if (instance == null) instance = new ConsoleLogger();
        return instance;
    }
    public void log(String msg) { System.out.println("[LOG] " + msg); }
}

// Decorator (Structural)
class TimestampLogger {
    private final ConsoleLogger logger;
    TimestampLogger(ConsoleLogger l) { logger = l; }
    public void log(String msg) {
        logger.log(LocalDateTime.now() + " - " + msg);
    }
}

// Observer (Behavioral)
class EventSystem {
    private final TimestampLogger logger;
    private final List<Consumer<String>> observers = new ArrayList<>();

    EventSystem(TimestampLogger l) { logger = l; }

    public void subscribe(Consumer<String> observer) { observers.add(observer); }

    public void notify(String event) {
        logger.log("Event: " + event);
        observers.forEach(obs -> obs.accept(event));
    }

    public static void main(String[] args) {
        TimestampLogger logger = new TimestampLogger(ConsoleLogger.getInstance());
        EventSystem events = new EventSystem(logger);
        events.subscribe(e -> System.out.println("Handler 1: " + e));
        events.subscribe(e -> System.out.println("Handler 2: " + e));
        events.notify("user_registered");
    }
}`,

      cpp: `#include <iostream>
#include <vector>
#include <functional>
#include <chrono>
#include <ctime>
#include <string>

// Singleton (Creational)
class ConsoleLogger {
    ConsoleLogger() = default;
public:
    static ConsoleLogger& getInstance() {
        static ConsoleLogger instance;
        return instance;
    }
    void log(const std::string& msg) {
        std::cout << "[LOG] " << msg << std::endl;
    }
};

// Decorator (Structural)
class TimestampLogger {
    ConsoleLogger& logger;
public:
    explicit TimestampLogger(ConsoleLogger& l) : logger(l) {}
    void log(const std::string& msg) {
        auto now = std::time(nullptr);
        logger.log(std::string(std::ctime(&now)).substr(0,24) + " - " + msg);
    }
};

// Observer (Behavioral)
class EventSystem {
    TimestampLogger& logger;
    std::vector<std::function<void(std::string)>> observers;
public:
    explicit EventSystem(TimestampLogger& l) : logger(l) {}
    void subscribe(std::function<void(std::string)> obs) { observers.push_back(obs); }
    void notify(const std::string& event) {
        logger.log("Event: " + event);
        for (auto& obs : observers) obs(event);
    }
};

int main() {
    TimestampLogger logger(ConsoleLogger::getInstance());
    EventSystem events(logger);
    events.subscribe([](const std::string& e){ std::cout << "Handler 1: " << e << std::endl; });
    events.subscribe([](const std::string& e){ std::cout << "Handler 2: " << e << std::endl; });
    events.notify("user_registered");
    return 0;
}`,

      typescript: `// Singleton (Creational)
class ConsoleLogger {
  private static instance: ConsoleLogger;
  private constructor() {}
  static getInstance(): ConsoleLogger {
    if (!ConsoleLogger.instance) ConsoleLogger.instance = new ConsoleLogger();
    return ConsoleLogger.instance;
  }
  log(msg: string): void { console.log(\`[LOG] \${msg}\`); }
}

// Decorator (Structural)
class TimestampLogger {
  constructor(private logger: ConsoleLogger) {}
  log(msg: string): void {
    this.logger.log(\`\${new Date().toISOString()} - \${msg}\`);
  }
}

// Observer (Behavioral)
class EventSystem {
  private observers: Array<(event: string) => void> = [];
  constructor(private logger: TimestampLogger) {}

  subscribe(observer: (event: string) => void): void {
    this.observers.push(observer);
  }

  notify(event: string): void {
    this.logger.log(\`Event: \${event}\`);
    this.observers.forEach(obs => obs(event));
  }
}

const logger = new TimestampLogger(ConsoleLogger.getInstance());
const events = new EventSystem(logger);
events.subscribe(e => console.log(\`Handler 1: \${e}\`));
events.subscribe(e => console.log(\`Handler 2: \${e}\`));
events.notify("user_registered");`,
    },
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
    code: {
      python: `from abc import ABC, abstractmethod


class OrderRepository(ABC):
    @abstractmethod
    def save(self, order: dict) -> str: pass


class NotificationService(ABC):
    @abstractmethod
    def notify(self, recipient: str, message: str) -> bool: pass


class PaymentProcessor(ABC):
    @abstractmethod
    def charge(self, amount: float) -> bool: pass


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


# High cohesion, low coupling
class OrderService:
    def __init__(self, repo, notifier, payment):
        self._repo = repo
        self._notifier = notifier
        self._payment = payment

    def place_order(self, items: list, email: str) -> str:
        total = sum(item['price'] for item in items)
        if not self._payment.charge(total):
            raise Exception("Payment failed")
        order_id = self._repo.save({"items": items, "total": total})
        self._notifier.notify(email, f"Order {order_id} confirmed!")
        return order_id


service = OrderService(
    SQLOrderRepository(),
    EmailNotificationService(),
    StripePaymentProcessor()
)
service.place_order([{"name": "Laptop", "price": 999.99}], "user@example.com")`,

      java: `interface OrderRepository {
    String save(String orderInfo);
}

interface NotificationService {
    boolean notify(String recipient, String message);
}

interface PaymentProcessor {
    boolean charge(double amount);
}

class SQLOrderRepository implements OrderRepository {
    public String save(String info) {
        System.out.println("Saving to SQL DB: " + info);
        return "ORD-001";
    }
}

class EmailNotificationService implements NotificationService {
    public boolean notify(String recipient, String message) {
        System.out.println("Email to " + recipient + ": " + message);
        return true;
    }
}

class StripePaymentProcessor implements PaymentProcessor {
    public boolean charge(double amount) {
        System.out.printf("Charging %.2f via Stripe%n", amount);
        return true;
    }
}

class OrderService {
    private final OrderRepository repo;
    private final NotificationService notifier;
    private final PaymentProcessor payment;

    OrderService(OrderRepository r, NotificationService n, PaymentProcessor p) {
        repo = r; notifier = n; payment = p;
    }

    public String placeOrder(double total, String email) {
        if (!payment.charge(total)) throw new RuntimeException("Payment failed");
        String orderId = repo.save("total=" + total);
        notifier.notify(email, "Order " + orderId + " confirmed!");
        return orderId;
    }

    public static void main(String[] args) {
        new OrderService(
            new SQLOrderRepository(),
            new EmailNotificationService(),
            new StripePaymentProcessor()
        ).placeOrder(999.99, "user@example.com");
    }
}`,

      cpp: `#include <iostream>
#include <string>

class OrderRepository {
public:
    virtual ~OrderRepository() = default;
    virtual std::string save(const std::string& info) = 0;
};

class NotificationService {
public:
    virtual ~NotificationService() = default;
    virtual bool notify(const std::string& recipient, const std::string& msg) = 0;
};

class PaymentProcessor {
public:
    virtual ~PaymentProcessor() = default;
    virtual bool charge(double amount) = 0;
};

class SQLOrderRepository : public OrderRepository {
public:
    std::string save(const std::string& info) override {
        std::cout << "Saving to SQL DB: " << info << std::endl;
        return "ORD-001";
    }
};

class EmailNotificationService : public NotificationService {
public:
    bool notify(const std::string& recipient, const std::string& msg) override {
        std::cout << "Email to " << recipient << ": " << msg << std::endl;
        return true;
    }
};

class StripePaymentProcessor : public PaymentProcessor {
public:
    bool charge(double amount) override {
        std::cout << "Charging " << amount << " via Stripe" << std::endl;
        return true;
    }
};

class OrderService {
    OrderRepository& repo;
    NotificationService& notifier;
    PaymentProcessor& payment;
public:
    OrderService(OrderRepository& r, NotificationService& n, PaymentProcessor& p)
        : repo(r), notifier(n), payment(p) {}

    std::string placeOrder(double total, const std::string& email) {
        if (!payment.charge(total)) throw std::runtime_error("Payment failed");
        std::string orderId = repo.save("total=" + std::to_string(total));
        notifier.notify(email, "Order " + orderId + " confirmed!");
        return orderId;
    }
};

int main() {
    SQLOrderRepository repo;
    EmailNotificationService notifier;
    StripePaymentProcessor payment;
    OrderService service(repo, notifier, payment);
    service.placeOrder(999.99, "user@example.com");
    return 0;
}`,

      typescript: `interface OrderRepository { save(info: string): string; }
interface NotificationService { notify(recipient: string, message: string): boolean; }
interface PaymentProcessor { charge(amount: number): boolean; }

class SQLOrderRepository implements OrderRepository {
  save(info: string): string {
    console.log(\`Saving to SQL DB: \${info}\`);
    return "ORD-001";
  }
}

class EmailNotificationService implements NotificationService {
  notify(recipient: string, message: string): boolean {
    console.log(\`Email to \${recipient}: \${message}\`);
    return true;
  }
}

class StripePaymentProcessor implements PaymentProcessor {
  charge(amount: number): boolean {
    console.log(\`Charging \${amount.toFixed(2)} via Stripe\`);
    return true;
  }
}

class OrderService {
  constructor(
    private repo: OrderRepository,
    private notifier: NotificationService,
    private payment: PaymentProcessor
  ) {}

  placeOrder(total: number, email: string): string {
    if (!this.payment.charge(total)) throw new Error("Payment failed");
    const orderId = this.repo.save(\`total=\${total}\`);
    this.notifier.notify(email, \`Order \${orderId} confirmed!\`);
    return orderId;
  }
}

new OrderService(
  new SQLOrderRepository(),
  new EmailNotificationService(),
  new StripePaymentProcessor()
).placeOrder(999.99, "user@example.com");`,
    },
    realWorldExample: 'A tightly coupled system is like hardwiring all electrical appliances. A loosely coupled system uses sockets and plugs - you can swap any appliance without rewiring. Microservices architecture achieves loose coupling by having services communicate through well-defined APIs.',
  },
];

export function getConceptBySlug(slug: string): OOPConcept | undefined {
  return oopConcepts.find((c) => c.slug === slug);
}
