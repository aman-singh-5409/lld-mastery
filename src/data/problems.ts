export interface MultiLangCode {
  python: string;
  java: string;
  cpp: string;
  typescript: string;
}

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
  code?: MultiLangCode;
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
    code: {
      python: `import threading
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
      java: `import java.util.*;
import java.util.concurrent.locks.ReentrantLock;

enum VehicleSize { COMPACT, LARGE, MOTORCYCLE }

abstract class Vehicle {
    protected String licensePlate;
    protected VehicleSize size;
    public Vehicle(String licensePlate, VehicleSize size) {
        this.licensePlate = licensePlate;
        this.size = size;
    }
    public String getLicensePlate() { return licensePlate; }
    public VehicleSize getSize() { return size; }
}

class Car extends Vehicle {
    public Car(String licensePlate) { super(licensePlate, VehicleSize.COMPACT); }
}

class Motorcycle extends Vehicle {
    public Motorcycle(String licensePlate) { super(licensePlate, VehicleSize.MOTORCYCLE); }
}

class ParkingSpot {
    private String spotId;
    private VehicleSize spotType;
    private Vehicle vehicle;
    private ReentrantLock lock = new ReentrantLock();

    public ParkingSpot(String spotId, VehicleSize spotType) {
        this.spotId = spotId;
        this.spotType = spotType;
    }

    public boolean isAvailable() { return vehicle == null; }
    public String getSpotId() { return spotId; }

    public boolean parkVehicle(Vehicle v) {
        lock.lock();
        try {
            if (isAvailable() && spotType == v.getSize()) {
                vehicle = v;
                return true;
            }
            return false;
        } finally { lock.unlock(); }
    }

    public void unparkVehicle() {
        lock.lock();
        try { vehicle = null; }
        finally { lock.unlock(); }
    }
}

class ParkingFloor {
    private int floorId;
    private List<ParkingSpot> spots;

    public ParkingFloor(int floorId, List<ParkingSpot> spots) {
        this.floorId = floorId;
        this.spots = spots;
    }

    public Optional<ParkingSpot> parkVehicle(Vehicle v) {
        return spots.stream()
            .filter(s -> s.isAvailable() && s.parkVehicle(v))
            .findFirst();
    }
}

class ParkingLot {
    private static ParkingLot instance;
    private static final Object lock = new Object();
    private List<ParkingFloor> floors = new ArrayList<>();
    private Map<String, ParkingSpot> activeTickets = new HashMap<>();

    private ParkingLot() {}

    public static ParkingLot getInstance() {
        if (instance == null) {
            synchronized (lock) {
                if (instance == null) instance = new ParkingLot();
            }
        }
        return instance;
    }

    public synchronized void addFloor(ParkingFloor floor) { floors.add(floor); }

    public synchronized Optional<ParkingSpot> parkVehicle(Vehicle v) {
        for (ParkingFloor floor : floors) {
            Optional<ParkingSpot> spot = floor.parkVehicle(v);
            if (spot.isPresent()) {
                activeTickets.put(v.getLicensePlate(), spot.get());
                System.out.println("Parked " + v.getLicensePlate() + " at " + spot.get().getSpotId());
                return spot;
            }
        }
        System.out.println("No spot available for " + v.getLicensePlate());
        return Optional.empty();
    }

    public synchronized void unparkVehicle(String plate) {
        ParkingSpot spot = activeTickets.remove(plate);
        if (spot != null) {
            spot.unparkVehicle();
            System.out.println("Unparked " + plate + " from " + spot.getSpotId());
        }
    }
}

// Demo
public class Main {
    public static void main(String[] args) {
        ParkingLot lot = ParkingLot.getInstance();
        lot.addFloor(new ParkingFloor(1, Arrays.asList(
            new ParkingSpot("1A", VehicleSize.COMPACT),
            new ParkingSpot("1B", VehicleSize.COMPACT),
            new ParkingSpot("1C", VehicleSize.LARGE)
        )));
        lot.parkVehicle(new Car("ABC-123"));
        lot.parkVehicle(new Car("XYZ-789"));
        lot.unparkVehicle("ABC-123");
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <unordered_map>
#include <mutex>
#include <memory>
#include <optional>
using namespace std;

enum class VehicleSize { COMPACT, LARGE, MOTORCYCLE };

class Vehicle {
public:
    string licensePlate;
    VehicleSize size;
    Vehicle(string plate, VehicleSize sz) : licensePlate(plate), size(sz) {}
};

class Car : public Vehicle {
public:
    Car(string plate) : Vehicle(plate, VehicleSize::COMPACT) {}
};

class ParkingSpot {
    string spotId;
    VehicleSize spotType;
    shared_ptr<Vehicle> vehicle;
    mutex mtx;
public:
    ParkingSpot(string id, VehicleSize type) : spotId(id), spotType(type) {}
    bool isAvailable() { return vehicle == nullptr; }
    string getSpotId() { return spotId; }

    bool parkVehicle(shared_ptr<Vehicle> v) {
        lock_guard<mutex> lock(mtx);
        if (isAvailable() && spotType == v->size) {
            vehicle = v;
            return true;
        }
        return false;
    }

    void unparkVehicle() {
        lock_guard<mutex> lock(mtx);
        vehicle = nullptr;
    }
};

class ParkingFloor {
    int floorId;
    vector<shared_ptr<ParkingSpot>> spots;
public:
    ParkingFloor(int id, vector<shared_ptr<ParkingSpot>> s) : floorId(id), spots(s) {}

    shared_ptr<ParkingSpot> parkVehicle(shared_ptr<Vehicle> v) {
        for (auto& spot : spots) {
            if (spot->isAvailable() && spot->parkVehicle(v)) return spot;
        }
        return nullptr;
    }
};

class ParkingLot {
    static ParkingLot* instance;
    static mutex instanceMutex;
    vector<shared_ptr<ParkingFloor>> floors;
    unordered_map<string, shared_ptr<ParkingSpot>> activeTickets;
    mutex mainMutex;

    ParkingLot() {}
public:
    static ParkingLot* getInstance() {
        if (!instance) {
            lock_guard<mutex> lock(instanceMutex);
            if (!instance) instance = new ParkingLot();
        }
        return instance;
    }

    void addFloor(shared_ptr<ParkingFloor> floor) { floors.push_back(floor); }

    void parkVehicle(shared_ptr<Vehicle> v) {
        lock_guard<mutex> lock(mainMutex);
        for (auto& floor : floors) {
            auto spot = floor->parkVehicle(v);
            if (spot) {
                activeTickets[v->licensePlate] = spot;
                cout << "Parked " << v->licensePlate << " at " << spot->getSpotId() << endl;
                return;
            }
        }
        cout << "No spot for " << v->licensePlate << endl;
    }

    void unparkVehicle(const string& plate) {
        lock_guard<mutex> lock(mainMutex);
        auto it = activeTickets.find(plate);
        if (it != activeTickets.end()) {
            it->second->unparkVehicle();
            cout << "Unparked " << plate << " from " << it->second->getSpotId() << endl;
            activeTickets.erase(it);
        }
    }
};

ParkingLot* ParkingLot::instance = nullptr;
mutex ParkingLot::instanceMutex;

int main() {
    auto lot = ParkingLot::getInstance();
    auto floor1 = make_shared<ParkingFloor>(1, vector<shared_ptr<ParkingSpot>>{
        make_shared<ParkingSpot>("1A", VehicleSize::COMPACT),
        make_shared<ParkingSpot>("1B", VehicleSize::COMPACT),
        make_shared<ParkingSpot>("1C", VehicleSize::LARGE),
    });
    lot->addFloor(floor1);
    lot->parkVehicle(make_shared<Car>("ABC-123"));
    lot->parkVehicle(make_shared<Car>("XYZ-789"));
    lot->unparkVehicle("ABC-123");
    return 0;
}`,
      typescript: `enum VehicleSize { COMPACT = "COMPACT", LARGE = "LARGE", MOTORCYCLE = "MOTORCYCLE" }

abstract class Vehicle {
  constructor(public licensePlate: string, public size: VehicleSize) {}
}

class Car extends Vehicle {
  constructor(licensePlate: string) { super(licensePlate, VehicleSize.COMPACT); }
}

class Motorcycle extends Vehicle {
  constructor(licensePlate: string) { super(licensePlate, VehicleSize.MOTORCYCLE); }
}

class ParkingSpot {
  private vehicle: Vehicle | null = null;
  constructor(public spotId: string, public spotType: VehicleSize) {}

  isAvailable(): boolean { return this.vehicle === null; }

  parkVehicle(v: Vehicle): boolean {
    if (this.isAvailable() && this.spotType === v.size) {
      this.vehicle = v;
      return true;
    }
    return false;
  }

  unparkVehicle(): void { this.vehicle = null; }
}

class ParkingFloor {
  constructor(public floorId: number, private spots: ParkingSpot[]) {}

  parkVehicle(v: Vehicle): ParkingSpot | null {
    return this.spots.find(s => s.isAvailable() && s.parkVehicle(v)) ?? null;
  }
}

class ParkingLot {
  private static instance: ParkingLot;
  private floors: ParkingFloor[] = [];
  private activeTickets = new Map<string, ParkingSpot>();

  private constructor() {}

  static getInstance(): ParkingLot {
    if (!ParkingLot.instance) ParkingLot.instance = new ParkingLot();
    return ParkingLot.instance;
  }

  addFloor(floor: ParkingFloor): void { this.floors.push(floor); }

  parkVehicle(v: Vehicle): ParkingSpot | null {
    for (const floor of this.floors) {
      const spot = floor.parkVehicle(v);
      if (spot) {
        this.activeTickets.set(v.licensePlate, spot);
        console.log(\`Parked \${v.licensePlate} at \${spot.spotId}\`);
        return spot;
      }
    }
    console.log(\`No spot for \${v.licensePlate}\`);
    return null;
  }

  unparkVehicle(plate: string): void {
    const spot = this.activeTickets.get(plate);
    if (spot) {
      spot.unparkVehicle();
      this.activeTickets.delete(plate);
      console.log(\`Unparked \${plate} from \${spot.spotId}\`);
    }
  }
}

// Demo
const lot = ParkingLot.getInstance();
lot.addFloor(new ParkingFloor(1, [
  new ParkingSpot("1A", VehicleSize.COMPACT),
  new ParkingSpot("1B", VehicleSize.COMPACT),
  new ParkingSpot("1C", VehicleSize.LARGE),
]));
lot.parkVehicle(new Car("ABC-123"));
lot.parkVehicle(new Car("XYZ-789"));
lot.unparkVehicle("ABC-123");`,
    },
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
    code: {
      python: `from enum import Enum
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
      java: `import java.util.*;

enum Coin { PENNY(1), NICKEL(5), DIME(10), QUARTER(25);
    final int value;
    Coin(int v) { this.value = v; }
}

class Product {
    String name; int price; int quantity;
    Product(String name, int price, int qty) { this.name=name; this.price=price; this.quantity=qty; }
    boolean isAvailable() { return quantity > 0; }
    void dispense() { if (quantity > 0) quantity--; }
}

interface VMState {
    void insertCoin(VendingMachine m, Coin c);
    void selectItem(VendingMachine m, String code);
    void dispense(VendingMachine m);
}

class IdleState implements VMState {
    public void insertCoin(VendingMachine m, Coin c) {
        m.balance += c.value;
        System.out.println("Inserted " + c + ". Balance: " + m.balance);
        m.state = new ReadyState();
    }
    public void selectItem(VendingMachine m, String code) { System.out.println("Insert coin first."); }
    public void dispense(VendingMachine m) { System.out.println("No item selected."); }
}

class ReadyState implements VMState {
    public void insertCoin(VendingMachine m, Coin c) { m.balance += c.value; }
    public void selectItem(VendingMachine m, String code) {
        Product p = m.inventory.get(code);
        if (p == null) { System.out.println("Invalid code"); return; }
        if (!p.isAvailable()) { System.out.println("Out of stock"); return; }
        if (m.balance < p.price) { System.out.println("Need " + (p.price - m.balance) + " more cents"); return; }
        m.selected = code; m.state = new DispenseState();
        System.out.println("Selected: " + p.name);
    }
    public void dispense(VendingMachine m) { System.out.println("Select item first."); }
}

class DispenseState implements VMState {
    public void insertCoin(VendingMachine m, Coin c) { System.out.println("Dispensing in progress."); }
    public void selectItem(VendingMachine m, String code) { System.out.println("Dispensing in progress."); }
    public void dispense(VendingMachine m) {
        Product p = m.inventory.get(m.selected);
        int change = m.balance - p.price;
        p.dispense(); m.balance = 0; m.selected = null; m.state = new IdleState();
        System.out.println("Dispensing " + p.name);
        if (change > 0) System.out.println("Change: " + change + " cents");
    }
}

class VendingMachine {
    private static VendingMachine instance;
    Map<String, Product> inventory = new HashMap<>();
    VMState state = new IdleState();
    int balance = 0; String selected = null;

    private VendingMachine() {}
    public static synchronized VendingMachine getInstance() {
        if (instance == null) instance = new VendingMachine();
        return instance;
    }
    public void addProduct(String code, Product p) { inventory.put(code, p); }
    public void insertCoin(Coin c) { state.insertCoin(this, c); }
    public void selectItem(String code) { state.selectItem(this, code); }
    public void dispense() { state.dispense(this); }
}

public class Main {
    public static void main(String[] args) {
        VendingMachine vm = VendingMachine.getInstance();
        vm.addProduct("A1", new Product("Cola", 50, 5));
        vm.insertCoin(Coin.QUARTER); vm.insertCoin(Coin.QUARTER);
        vm.selectItem("A1"); vm.dispense();
    }
}`,
      cpp: `#include <iostream>
#include <unordered_map>
#include <string>
using namespace std;

enum class Coin { PENNY=1, NICKEL=5, DIME=10, QUARTER=25 };

struct Product {
    string name; int price; int quantity;
    bool isAvailable() { return quantity > 0; }
    void dispense() { if (quantity > 0) quantity--; }
};

class VendingMachine;

struct VMState {
    virtual void insertCoin(VendingMachine& m, Coin c) = 0;
    virtual void selectItem(VendingMachine& m, const string& code) = 0;
    virtual void dispense(VendingMachine& m) = 0;
    virtual ~VMState() = default;
};

class VendingMachine {
    static VendingMachine* instance;
    VendingMachine() : balance(0), state(nullptr) {}
public:
    unordered_map<string, Product> inventory;
    VMState* state;
    int balance;
    string selected;

    static VendingMachine* getInstance() {
        if (!instance) instance = new VendingMachine();
        return instance;
    }
    void addProduct(const string& code, Product p) { inventory[code] = p; }
    void insertCoin(Coin c);
    void selectItem(const string& code);
    void dispense();
};
VendingMachine* VendingMachine::instance = nullptr;

struct IdleState : VMState {
    void insertCoin(VendingMachine& m, Coin c) override;
    void selectItem(VendingMachine& m, const string& code) override { cout << "Insert coin first\\n"; }
    void dispense(VendingMachine& m) override { cout << "No item selected\\n"; }
};
struct ReadyState : VMState {
    void insertCoin(VendingMachine& m, Coin c) override { m.balance += (int)c; }
    void selectItem(VendingMachine& m, const string& code) override;
    void dispense(VendingMachine& m) override { cout << "Select item first\\n"; }
};
struct DispenseState : VMState {
    void insertCoin(VendingMachine& m, Coin c) override { cout << "Dispensing\\n"; }
    void selectItem(VendingMachine& m, const string& code) override { cout << "Dispensing\\n"; }
    void dispense(VendingMachine& m) override {
        Product& p = m.inventory[m.selected];
        int change = m.balance - p.price;
        p.dispense(); m.balance = 0; m.selected = "";
        delete m.state; m.state = new IdleState();
        cout << "Dispensing " << p.name << "\\n";
        if (change > 0) cout << "Change: " << change << "\\n";
    }
};

void IdleState::insertCoin(VendingMachine& m, Coin c) {
    m.balance += (int)c;
    cout << "Balance: " << m.balance << "\\n";
    delete m.state; m.state = new ReadyState();
}
void ReadyState::selectItem(VendingMachine& m, const string& code) {
    auto it = m.inventory.find(code);
    if (it == m.inventory.end()) { cout << "Invalid\\n"; return; }
    if (m.balance >= it->second.price) {
        m.selected = code;
        delete m.state; m.state = new DispenseState();
        cout << "Selected: " << it->second.name << "\\n";
    } else cout << "Need more coins\\n";
}
void VendingMachine::insertCoin(Coin c) { state->insertCoin(*this, c); }
void VendingMachine::selectItem(const string& code) { state->selectItem(*this, code); }
void VendingMachine::dispense() { state->dispense(*this); }

int main() {
    auto vm = VendingMachine::getInstance();
    vm->state = new IdleState();
    vm->addProduct("A1", {"Cola", 50, 5});
    vm->insertCoin(Coin::QUARTER); vm->insertCoin(Coin::QUARTER);
    vm->selectItem("A1"); vm->dispense();
    return 0;
}`,
      typescript: `enum Coin { PENNY = 1, NICKEL = 5, DIME = 10, QUARTER = 25 }

class Product {
  constructor(public name: string, public price: number, public quantity: number) {}
  isAvailable(): boolean { return this.quantity > 0; }
  dispense(): void { if (this.quantity > 0) this.quantity--; }
}

interface VMState {
  insertCoin(m: VendingMachine, coin: Coin): void;
  selectItem(m: VendingMachine, code: string): void;
  dispense(m: VendingMachine): void;
}

class IdleState implements VMState {
  insertCoin(m: VendingMachine, coin: Coin) {
    m.balance += coin;
    console.log(\`Inserted \${Coin[coin]}. Balance: \${m.balance}\`);
    m.state = new ReadyState();
  }
  selectItem(_m: VendingMachine, _code: string) { console.log("Insert coin first."); }
  dispense(_m: VendingMachine) { console.log("No item selected."); }
}

class ReadyState implements VMState {
  insertCoin(m: VendingMachine, coin: Coin) { m.balance += coin; }
  selectItem(m: VendingMachine, code: string) {
    const p = m.inventory.get(code);
    if (!p) { console.log("Invalid code"); return; }
    if (!p.isAvailable()) { console.log("Out of stock"); return; }
    if (m.balance < p.price) { console.log(\`Need \${p.price - m.balance} more cents\`); return; }
    m.selected = code;
    m.state = new DispenseState();
    console.log(\`Selected: \${p.name}\`);
  }
  dispense(_m: VendingMachine) { console.log("Select item first."); }
}

class DispenseState implements VMState {
  insertCoin(_m: VendingMachine, _coin: Coin) { console.log("Dispensing in progress."); }
  selectItem(_m: VendingMachine, _code: string) { console.log("Dispensing in progress."); }
  dispense(m: VendingMachine) {
    const p = m.inventory.get(m.selected!)!;
    const change = m.balance - p.price;
    p.dispense(); m.balance = 0; m.selected = null;
    m.state = new IdleState();
    console.log(\`Dispensing \${p.name}\`);
    if (change > 0) console.log(\`Change: \${change} cents\`);
  }
}

class VendingMachine {
  private static instance: VendingMachine;
  inventory = new Map<string, Product>();
  state: VMState = new IdleState();
  balance = 0;
  selected: string | null = null;

  private constructor() {}
  static getInstance(): VendingMachine {
    if (!VendingMachine.instance) VendingMachine.instance = new VendingMachine();
    return VendingMachine.instance;
  }
  addProduct(code: string, product: Product) { this.inventory.set(code, product); }
  insertCoin(coin: Coin) { this.state.insertCoin(this, coin); }
  selectItem(code: string) { this.state.selectItem(this, code); }
  dispense() { this.state.dispense(this); }
}

// Demo
const vm = VendingMachine.getInstance();
vm.addProduct("A1", new Product("Cola", 50, 5));
vm.insertCoin(Coin.QUARTER); vm.insertCoin(Coin.QUARTER);
vm.selectItem("A1"); vm.dispense();`,
    },
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
    code: {
      python: `import threading
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
      java: `import java.util.*;
import java.util.concurrent.locks.ReentrantReadWriteLock;

class LRUCache {
    private final int capacity;
    private final Map<Integer, Node> cache = new HashMap<>();
    private final Node head, tail;
    private final ReentrantReadWriteLock lock = new ReentrantReadWriteLock();

    private static class Node {
        int key, value;
        Node prev, next;
        Node(int k, int v) { key = k; value = v; }
    }

    public LRUCache(int capacity) {
        this.capacity = capacity;
        head = new Node(0, 0);
        tail = new Node(0, 0);
        head.next = tail;
        tail.prev = head;
    }

    private void remove(Node n) {
        n.prev.next = n.next;
        n.next.prev = n.prev;
    }

    private void addToFront(Node n) {
        n.next = head.next; n.prev = head;
        head.next.prev = n; head.next = n;
    }

    public int get(int key) {
        lock.writeLock().lock();
        try {
            if (!cache.containsKey(key)) return -1;
            Node n = cache.get(key);
            remove(n); addToFront(n);
            return n.value;
        } finally { lock.writeLock().unlock(); }
    }

    public void put(int key, int value) {
        lock.writeLock().lock();
        try {
            if (cache.containsKey(key)) {
                Node n = cache.get(key);
                n.value = value;
                remove(n); addToFront(n);
            } else {
                if (cache.size() >= capacity) {
                    Node lru = tail.prev;
                    remove(lru); cache.remove(lru.key);
                }
                Node n = new Node(key, value);
                addToFront(n); cache.put(key, n);
            }
        } finally { lock.writeLock().unlock(); }
    }
}

public class Main {
    public static void main(String[] args) {
        LRUCache cache = new LRUCache(3);
        cache.put(1, 10); cache.put(2, 20); cache.put(3, 30);
        System.out.println(cache.get(1)); // 10
        cache.put(4, 40); // evicts 2
        System.out.println(cache.get(2)); // -1
        System.out.println(cache.get(3)); // 30
    }
}`,
      cpp: `#include <iostream>
#include <unordered_map>
#include <mutex>
using namespace std;

class LRUCache {
    struct Node {
        int key, value;
        Node *prev, *next;
        Node(int k, int v) : key(k), value(v), prev(nullptr), next(nullptr) {}
    };

    int capacity;
    unordered_map<int, Node*> cache;
    Node *head, *tail;
    mutex mtx;

    void remove(Node* n) {
        n->prev->next = n->next;
        n->next->prev = n->prev;
    }

    void addToFront(Node* n) {
        n->next = head->next; n->prev = head;
        head->next->prev = n; head->next = n;
    }

public:
    LRUCache(int cap) : capacity(cap) {
        head = new Node(0, 0); tail = new Node(0, 0);
        head->next = tail; tail->prev = head;
    }

    int get(int key) {
        lock_guard<mutex> lock(mtx);
        auto it = cache.find(key);
        if (it == cache.end()) return -1;
        remove(it->second); addToFront(it->second);
        return it->second->value;
    }

    void put(int key, int value) {
        lock_guard<mutex> lock(mtx);
        auto it = cache.find(key);
        if (it != cache.end()) {
            it->second->value = value;
            remove(it->second); addToFront(it->second);
        } else {
            if ((int)cache.size() >= capacity) {
                Node* lru = tail->prev;
                remove(lru); cache.erase(lru->key); delete lru;
            }
            Node* n = new Node(key, value);
            addToFront(n); cache[key] = n;
        }
    }
};

int main() {
    LRUCache cache(3);
    cache.put(1, 10); cache.put(2, 20); cache.put(3, 30);
    cout << cache.get(1) << endl; // 10
    cache.put(4, 40); // evicts 2
    cout << cache.get(2) << endl; // -1
    cout << cache.get(3) << endl; // 30
    return 0;
}`,
      typescript: `class LRUNode {
  constructor(
    public key: number,
    public value: number,
    public prev: LRUNode | null = null,
    public next: LRUNode | null = null
  ) {}
}

class LRUCache {
  private cache = new Map<number, LRUNode>();
  private head: LRUNode;
  private tail: LRUNode;

  constructor(private capacity: number) {
    this.head = new LRUNode(0, 0);
    this.tail = new LRUNode(0, 0);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  private remove(n: LRUNode) {
    n.prev!.next = n.next;
    n.next!.prev = n.prev;
  }

  private addToFront(n: LRUNode) {
    n.next = this.head.next;
    n.prev = this.head;
    this.head.next!.prev = n;
    this.head.next = n;
  }

  get(key: number): number {
    const n = this.cache.get(key);
    if (!n) return -1;
    this.remove(n);
    this.addToFront(n);
    return n.value;
  }

  put(key: number, value: number): void {
    const existing = this.cache.get(key);
    if (existing) {
      existing.value = value;
      this.remove(existing);
      this.addToFront(existing);
    } else {
      if (this.cache.size >= this.capacity) {
        const lru = this.tail.prev!;
        this.remove(lru);
        this.cache.delete(lru.key);
      }
      const n = new LRUNode(key, value);
      this.addToFront(n);
      this.cache.set(key, n);
    }
  }
}

// Demo
const cache = new LRUCache(3);
cache.put(1, 10); cache.put(2, 20); cache.put(3, 30);
console.log(cache.get(1)); // 10
cache.put(4, 40);           // evicts 2
console.log(cache.get(2)); // -1
console.log(cache.get(3)); // 30`,
    },
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
    code: {
      python: `from typing import List, Dict, Optional
import uuid
from datetime import datetime

class User:
    def __init__(self, user_id: str, username: str, email: str):
        self.user_id = user_id
        self.username = username
        self.email = email
        self.reputation = 0
        self.questions: List['Question'] = []
        self.answers: List['Answer'] = []

    def add_reputation(self, points: int):
        self.reputation += points

class Comment:
    def __init__(self, author: User, content: str):
        self.comment_id = str(uuid.uuid4())
        self.author = author
        self.content = content
        self.created_at = datetime.now()

class Answer:
    def __init__(self, author: User, content: str):
        self.answer_id = str(uuid.uuid4())
        self.author = author
        self.content = content
        self.votes = 0
        self.comments: List[Comment] = []
        self.is_accepted = False
        self.created_at = datetime.now()

    def vote(self, value: int):
        self.votes += value
        self.author.add_reputation(10 * value)

    def accept(self):
        self.is_accepted = True
        self.author.add_reputation(15)

class Question:
    def __init__(self, author: User, title: str, content: str, tags: List[str]):
        self.question_id = str(uuid.uuid4())
        self.author = author
        self.title = title
        self.content = content
        self.tags = tags
        self.votes = 0
        self.answers: List[Answer] = []
        self.comments: List[Comment] = []
        self.created_at = datetime.now()

    def add_answer(self, answer: Answer):
        self.answers.append(answer)

    def vote(self, value: int):
        self.votes += value
        self.author.add_reputation(5 * value)

class StackOverflow:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.questions: List[Question] = []
            cls._instance.users: Dict[str, User] = {}
        return cls._instance

    def register_user(self, username: str, email: str) -> User:
        user = User(str(uuid.uuid4()), username, email)
        self.users[user.user_id] = user
        return user

    def post_question(self, author: User, title: str, content: str, tags: List[str]) -> Question:
        q = Question(author, title, content, tags)
        self.questions.append(q)
        return q

    def search(self, keyword: str) -> List[Question]:
        kw = keyword.lower()
        return [q for q in self.questions if kw in q.title.lower() or kw in q.content.lower() or kw in q.tags]

# Demo
if __name__ == "__main__":
    so = StackOverflow()
    alice = so.register_user("alice", "alice@example.com")
    bob = so.register_user("bob", "bob@example.com")
    q = so.post_question(alice, "How does Python GIL work?", "Explain the GIL.", ["python", "concurrency"])
    ans = Answer(bob, "The GIL is a mutex that protects Python objects.")
    q.add_answer(ans)
    ans.vote(1)
    ans.accept()
    print(f"Bob reputation: {bob.reputation}")
    results = so.search("python")
    print(f"Found {len(results)} questions")`,
      java: `import java.util.*;

class User {
    String userId, username, email;
    int reputation = 0;
    User(String id, String name, String email) { userId=id; username=name; this.email=email; }
    void addReputation(int pts) { reputation += pts; }
}

class Comment {
    String commentId = UUID.randomUUID().toString();
    User author; String content;
    Comment(User author, String content) { this.author=author; this.content=content; }
}

class Answer {
    String answerId = UUID.randomUUID().toString();
    User author; String content;
    int votes = 0; boolean accepted = false;
    List<Comment> comments = new ArrayList<>();
    Answer(User author, String content) { this.author=author; this.content=content; }
    void vote(int v) { votes+=v; author.addReputation(10*v); }
    void accept() { accepted=true; author.addReputation(15); }
}

class Question {
    String questionId = UUID.randomUUID().toString();
    User author; String title, content;
    List<String> tags; int votes = 0;
    List<Answer> answers = new ArrayList<>();
    List<Comment> comments = new ArrayList<>();
    Question(User author, String title, String content, List<String> tags) {
        this.author=author; this.title=title; this.content=content; this.tags=tags;
    }
    void addAnswer(Answer a) { answers.add(a); }
    void vote(int v) { votes+=v; author.addReputation(5*v); }
}

class StackOverflow {
    private static StackOverflow instance;
    List<Question> questions = new ArrayList<>();
    Map<String, User> users = new HashMap<>();
    private StackOverflow() {}
    public static synchronized StackOverflow getInstance() {
        if (instance==null) instance = new StackOverflow();
        return instance;
    }
    public User registerUser(String name, String email) {
        User u = new User(UUID.randomUUID().toString(), name, email);
        users.put(u.userId, u); return u;
    }
    public Question postQuestion(User author, String title, String content, List<String> tags) {
        Question q = new Question(author, title, content, tags);
        questions.add(q); return q;
    }
    public List<Question> search(String keyword) {
        String kw = keyword.toLowerCase();
        List<Question> result = new ArrayList<>();
        for (Question q : questions)
            if (q.title.toLowerCase().contains(kw) || q.tags.contains(kw)) result.add(q);
        return result;
    }
}

public class Main {
    public static void main(String[] args) {
        StackOverflow so = StackOverflow.getInstance();
        User alice = so.registerUser("alice", "alice@ex.com");
        User bob = so.registerUser("bob", "bob@ex.com");
        Question q = so.postQuestion(alice, "Python GIL?", "Explain GIL.", Arrays.asList("python","concurrency"));
        Answer ans = new Answer(bob, "The GIL protects Python objects.");
        q.addAnswer(ans); ans.vote(1); ans.accept();
        System.out.println("Bob reputation: " + bob.reputation);
        System.out.println("Search results: " + so.search("python").size());
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <unordered_map>
#include <string>
#include <algorithm>
using namespace std;

struct User {
    string userId, username, email;
    int reputation = 0;
    void addReputation(int pts) { reputation += pts; }
};

struct Comment { string commentId, content; User* author; };

struct Answer {
    string answerId, content;
    User* author; int votes = 0; bool accepted = false;
    vector<Comment> comments;
    void vote(int v) { votes+=v; author->addReputation(10*v); }
    void accept() { accepted=true; author->addReputation(15); }
};

struct Question {
    string questionId, title, content;
    User* author; int votes = 0;
    vector<string> tags;
    vector<Answer> answers;
    void addAnswer(Answer a) { answers.push_back(a); }
    void vote(int v) { votes+=v; author->addReputation(5*v); }
};

class StackOverflow {
    static StackOverflow* instance;
    StackOverflow() {}
public:
    vector<Question> questions;
    unordered_map<string, User> users;

    static StackOverflow* getInstance() {
        if (!instance) instance = new StackOverflow();
        return instance;
    }
    User* registerUser(const string& name, const string& email) {
        string id = "u" + to_string(users.size()+1);
        users[id] = {id, name, email};
        return &users[id];
    }
    Question* postQuestion(User* author, const string& title, const string& content, vector<string> tags) {
        Question q; q.questionId = "q"+to_string(questions.size()+1);
        q.author=author; q.title=title; q.content=content; q.tags=tags;
        questions.push_back(q);
        return &questions.back();
    }
    vector<Question*> search(const string& keyword) {
        vector<Question*> result;
        for (auto& q : questions) {
            if (q.title.find(keyword) != string::npos ||
                find(q.tags.begin(), q.tags.end(), keyword) != q.tags.end())
                result.push_back(&q);
        }
        return result;
    }
};
StackOverflow* StackOverflow::instance = nullptr;

int main() {
    auto so = StackOverflow::getInstance();
    User* alice = so->registerUser("alice", "alice@ex.com");
    User* bob = so->registerUser("bob", "bob@ex.com");
    Question* q = so->postQuestion(alice, "Python GIL?", "Explain.", {"python","concurrency"});
    Answer ans; ans.answerId="a1"; ans.author=bob; ans.content="GIL protects objects.";
    q->addAnswer(ans);
    q->answers[0].vote(1); q->answers[0].accept();
    cout << "Bob reputation: " << bob->reputation << endl;
    cout << "Search results: " << so->search("python").size() << endl;
    return 0;
}`,
      typescript: `class User {
  userId: string;
  reputation = 0;
  constructor(userId: string, public username: string, public email: string) {
    this.userId = userId;
  }
  addReputation(pts: number) { this.reputation += pts; }
}

class Comment {
  commentId = Math.random().toString(36).slice(2);
  constructor(public author: User, public content: string) {}
}

class Answer {
  answerId = Math.random().toString(36).slice(2);
  votes = 0; accepted = false;
  comments: Comment[] = [];
  constructor(public author: User, public content: string) {}
  vote(v: number) { this.votes += v; this.author.addReputation(10 * v); }
  accept() { this.accepted = true; this.author.addReputation(15); }
}

class Question {
  questionId = Math.random().toString(36).slice(2);
  votes = 0;
  answers: Answer[] = [];
  comments: Comment[] = [];
  constructor(
    public author: User, public title: string,
    public content: string, public tags: string[]
  ) {}
  addAnswer(a: Answer) { this.answers.push(a); }
  vote(v: number) { this.votes += v; this.author.addReputation(5 * v); }
}

class StackOverflow {
  private static instance: StackOverflow;
  questions: Question[] = [];
  users = new Map<string, User>();

  private constructor() {}
  static getInstance(): StackOverflow {
    if (!StackOverflow.instance) StackOverflow.instance = new StackOverflow();
    return StackOverflow.instance;
  }
  registerUser(username: string, email: string): User {
    const u = new User(Math.random().toString(36).slice(2), username, email);
    this.users.set(u.userId, u); return u;
  }
  postQuestion(author: User, title: string, content: string, tags: string[]): Question {
    const q = new Question(author, title, content, tags);
    this.questions.push(q); return q;
  }
  search(keyword: string): Question[] {
    const kw = keyword.toLowerCase();
    return this.questions.filter(q =>
      q.title.toLowerCase().includes(kw) || q.tags.includes(kw));
  }
}

// Demo
const so = StackOverflow.getInstance();
const alice = so.registerUser("alice", "alice@ex.com");
const bob = so.registerUser("bob", "bob@ex.com");
const q = so.postQuestion(alice, "Python GIL?", "Explain GIL.", ["python", "concurrency"]);
const ans = new Answer(bob, "GIL protects objects.");
q.addAnswer(ans); ans.vote(1); ans.accept();
console.log("Bob reputation:", bob.reputation);
console.log("Search results:", so.search("python").length);`,
    },
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
    code: {
      python: `import threading
from enum import IntEnum
from datetime import datetime
from typing import List

class LogLevel(IntEnum):
    DEBUG = 1
    INFO = 2
    WARNING = 3
    ERROR = 4
    FATAL = 5

class LogMessage:
    def __init__(self, level: LogLevel, message: str):
        self.level = level
        self.message = message
        self.timestamp = datetime.now()

    def __str__(self):
        return f"[{self.timestamp.strftime('%Y-%m-%d %H:%M:%S')}] [{self.level.name}] {self.message}"

class LogAppender:
    def append(self, msg: LogMessage): pass

class ConsoleAppender(LogAppender):
    def append(self, msg: LogMessage):
        print(str(msg))

class FileAppender(LogAppender):
    def __init__(self, filename: str):
        self.filename = filename

    def append(self, msg: LogMessage):
        with open(self.filename, 'a') as f:
            f.write(str(msg) + '\\n')

class Logger:
    _instance = None
    _lock = threading.Lock()

    def __init__(self):
        self.level = LogLevel.DEBUG
        self.appenders: List[LogAppender] = [ConsoleAppender()]
        self._log_lock = threading.Lock()

    @staticmethod
    def get_instance():
        if Logger._instance is None:
            with Logger._lock:
                if Logger._instance is None:
                    Logger._instance = Logger()
        return Logger._instance

    def set_level(self, level: LogLevel):
        self.level = level

    def add_appender(self, appender: LogAppender):
        self.appenders.append(appender)

    def log(self, level: LogLevel, message: str):
        if level >= self.level:
            msg = LogMessage(level, message)
            with self._log_lock:
                for appender in self.appenders:
                    appender.append(msg)

    def debug(self, msg: str): self.log(LogLevel.DEBUG, msg)
    def info(self, msg: str): self.log(LogLevel.INFO, msg)
    def warning(self, msg: str): self.log(LogLevel.WARNING, msg)
    def error(self, msg: str): self.log(LogLevel.ERROR, msg)
    def fatal(self, msg: str): self.log(LogLevel.FATAL, msg)

# Demo
if __name__ == "__main__":
    logger = Logger.get_instance()
    logger.set_level(LogLevel.INFO)
    logger.info("Application started")
    logger.warning("Low memory warning")
    logger.error("Connection failed")
    logger.debug("This won't print (below INFO level)")`,
      java: `import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.locks.ReentrantLock;
import java.io.*;

enum LogLevel { DEBUG(1), INFO(2), WARNING(3), ERROR(4), FATAL(5);
    final int value;
    LogLevel(int v) { this.value = v; }
}

class LogMessage {
    LogLevel level; String message; LocalDateTime timestamp;
    LogMessage(LogLevel level, String msg) {
        this.level=level; this.message=msg; this.timestamp=LocalDateTime.now();
    }
    public String toString() {
        return "[" + timestamp + "] [" + level + "] " + message;
    }
}

interface LogAppender { void append(LogMessage msg); }

class ConsoleAppender implements LogAppender {
    public void append(LogMessage msg) { System.out.println(msg); }
}

class FileAppender implements LogAppender {
    private String filename;
    FileAppender(String filename) { this.filename = filename; }
    public void append(LogMessage msg) {
        try (FileWriter fw = new FileWriter(filename, true)) {
            fw.write(msg + "\\n");
        } catch (IOException e) { e.printStackTrace(); }
    }
}

class Logger {
    private static Logger instance;
    private LogLevel level = LogLevel.DEBUG;
    private List<LogAppender> appenders = new ArrayList<>();
    private ReentrantLock lock = new ReentrantLock();

    private Logger() { appenders.add(new ConsoleAppender()); }
    public static synchronized Logger getInstance() {
        if (instance == null) instance = new Logger();
        return instance;
    }
    public void setLevel(LogLevel level) { this.level = level; }
    public void addAppender(LogAppender a) { appenders.add(a); }
    public void log(LogLevel level, String message) {
        if (level.value >= this.level.value) {
            LogMessage msg = new LogMessage(level, message);
            lock.lock();
            try { for (LogAppender a : appenders) a.append(msg); }
            finally { lock.unlock(); }
        }
    }
    public void info(String msg) { log(LogLevel.INFO, msg); }
    public void warning(String msg) { log(LogLevel.WARNING, msg); }
    public void error(String msg) { log(LogLevel.ERROR, msg); }
    public void debug(String msg) { log(LogLevel.DEBUG, msg); }
}

public class Main {
    public static void main(String[] args) {
        Logger logger = Logger.getInstance();
        logger.setLevel(LogLevel.INFO);
        logger.info("Application started");
        logger.warning("Low memory");
        logger.error("Connection failed");
        logger.debug("Won't print");
    }
}`,
      cpp: `#include <iostream>
#include <fstream>
#include <vector>
#include <mutex>
#include <chrono>
#include <iomanip>
#include <sstream>
using namespace std;

enum class LogLevel { DEBUG=1, INFO=2, WARNING=3, ERROR=4, FATAL=5 };

string levelName(LogLevel l) {
    switch(l) {
        case LogLevel::DEBUG: return "DEBUG";
        case LogLevel::INFO: return "INFO";
        case LogLevel::WARNING: return "WARNING";
        case LogLevel::ERROR: return "ERROR";
        case LogLevel::FATAL: return "FATAL";
        default: return "UNKNOWN";
    }
}

struct LogMessage {
    LogLevel level; string message; string timestamp;
    LogMessage(LogLevel l, const string& m) : level(l), message(m) {
        auto now = chrono::system_clock::now();
        time_t t = chrono::system_clock::to_time_t(now);
        ostringstream oss;
        oss << put_time(localtime(&t), "%Y-%m-%d %H:%M:%S");
        timestamp = oss.str();
    }
    string str() const { return "[" + timestamp + "] [" + levelName(level) + "] " + message; }
};

struct LogAppender { virtual void append(const LogMessage& msg) = 0; virtual ~LogAppender()=default; };

struct ConsoleAppender : LogAppender {
    void append(const LogMessage& msg) override { cout << msg.str() << endl; }
};displayMenu

struct FileAppender : LogAppender {
    string filename;
    FileAppender(const string& fn) : filename(fn) {}
    void append(const LogMessage& msg) override {
        ofstream f(filename, ios::app);
        f << msg.str() << "\\n";
    }
};

class Logger {
    static Logger* instance;
    static mutex instanceMutex;
    LogLevel level = LogLevel::DEBUG;
    vector<LogAppender*> appenders;
    mutex logMutex;
    Logger() { appenders.push_back(new ConsoleAppender()); }
public:
    static Logger* getInstance() {
        if (!instance) {
            lock_guard<mutex> lock(instanceMutex);
            if (!instance) instance = new Logger();
        }
        return instance;
    }
    void setLevel(LogLevel l) { level = l; }
    void addAppender(LogAppender* a) { appenders.push_back(a); }
    void log(LogLevel l, const string& msg) {
        if ((int)l >= (int)level) {
            LogMessage logMsg(l, msg);
            lock_guard<mutex> lock(logMutex);
            for (auto a : appenders) a->append(logMsg);
        }
    }
    void info(const string& msg) { log(LogLevel::INFO, msg); }
    void warning(const string& msg) { log(LogLevel::WARNING, msg); }
    void error(const string& msg) { log(LogLevel::ERROR, msg); }
};
Logger* Logger::instance = nullptr;
mutex Logger::instanceMutex;

int main() {
    Logger* logger = Logger::getInstance();
    logger->setLevel(LogLevel::INFO);
    logger->info("Application started");
    logger->warning("Low memory");
    logger->error("Connection failed");
    return 0;
}`,
      typescript: `enum LogLevel { DEBUG = 1, INFO = 2, WARNING = 3, ERROR = 4, FATAL = 5 }

class LogMessage {
  timestamp: Date;
  constructor(public level: LogLevel, public message: string) {
    this.timestamp = new Date();
  }
  toString(): string {
    return \`[\${this.timestamp.toISOString()}] [\${LogLevel[this.level]}] \${this.message}\`;
  }
}

interface LogAppender { append(msg: LogMessage): void; }

class ConsoleAppender implements LogAppender {
  append(msg: LogMessage) { console.log(msg.toString()); }
}

class FileAppender implements LogAppender {
  constructor(private filename: string) {}
  append(msg: LogMessage) {
    // In Node.js: fs.appendFileSync(this.filename, msg.toString() + '\\n');
    console.log(\`[FILE:\${this.filename}] \${msg.toString()}\`);
  }
}

class Logger {
  private static instance: Logger;
  private level: LogLevel = LogLevel.DEBUG;
  private appenders: LogAppender[] = [new ConsoleAppender()];

  private constructor() {}
  static getInstance(): Logger {
    if (!Logger.instance) Logger.instance = new Logger();
    return Logger.instance;
  }
  setLevel(level: LogLevel) { this.level = level; }
  addAppender(appender: LogAppender) { this.appenders.push(appender); }
  log(level: LogLevel, message: string) {
    if (level >= this.level) {
      const msg = new LogMessage(level, message);
      this.appenders.forEach(a => a.append(msg));
    }
  }
  debug(msg: string) { this.log(LogLevel.DEBUG, msg); }
  info(msg: string) { this.log(LogLevel.INFO, msg); }
  warning(msg: string) { this.log(LogLevel.WARNING, msg); }
  error(msg: string) { this.log(LogLevel.ERROR, msg); }
  fatal(msg: string) { this.log(LogLevel.FATAL, msg); }
}

// Demo
const logger = Logger.getInstance();
logger.setLevel(LogLevel.INFO);
logger.info("Application started");
logger.warning("Low memory warning");
logger.error("Connection failed");
logger.debug("Won't print");`,
    },
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
    code: {
      python: `import threading
import time
from enum import Enum
from typing import List

class Signal(Enum):
    RED = "RED"
    YELLOW = "YELLOW"
    GREEN = "GREEN"

class TrafficLight:
    def __init__(self, road_name: str, green_duration: int = 30):
        self.road_name = road_name
        self.current_signal = Signal.RED
        self.green_duration = green_duration
        self.yellow_duration = 5

    def set_signal(self, signal: Signal):
        self.current_signal = signal
        print(f"Road '{self.road_name}': {signal.value}")

    def get_signal(self) -> Signal:
        return self.current_signal

class TrafficController:
    _instance = None
    _lock = threading.Lock()

    def __init__(self):
        self.lights: List[TrafficLight] = []
        self.running = False
        self.emergency_mode = False
        self._thread = None

    @staticmethod
    def get_instance():
        if TrafficController._instance is None:
            with TrafficController._lock:
                if TrafficController._instance is None:
                    TrafficController._instance = TrafficController()
        return TrafficController._instance

    def add_light(self, light: TrafficLight):
        self.lights.append(light)

    def start(self):
        self.running = True
        self._thread = threading.Thread(target=self._run_cycle, daemon=True)
        self._thread.start()

    def stop(self):
        self.running = False

    def trigger_emergency(self):
        self.emergency_mode = True
        print("EMERGENCY: All lights set to RED")
        for light in self.lights:
            light.set_signal(Signal.RED)

    def clear_emergency(self):
        self.emergency_mode = False
        print("Emergency cleared, resuming normal cycle")

    def _run_cycle(self):
        idx = 0
        while self.running:
            if self.emergency_mode:
                time.sleep(1)
                continue
            # Set current light green, others red
            for i, light in enumerate(self.lights):
                light.set_signal(Signal.GREEN if i == idx else Signal.RED)
            time.sleep(self.lights[idx].green_duration)
            # Yellow transition
            self.lights[idx].set_signal(Signal.YELLOW)
            time.sleep(self.lights[idx].yellow_duration)
            idx = (idx + 1) % len(self.lights)

# Demo
if __name__ == "__main__":
    controller = TrafficController.get_instance()
    controller.add_light(TrafficLight("North-South", green_duration=3))
    controller.add_light(TrafficLight("East-West", green_duration=3))
    controller.start()
    time.sleep(8)
    controller.trigger_emergency()
    time.sleep(2)
    controller.clear_emergency()
    time.sleep(4)
    controller.stop()`,
      java: `import java.util.*;
import java.util.concurrent.*;

enum Signal { RED, YELLOW, GREEN }

class TrafficLight {
    String roadName; Signal current = Signal.RED; int greenDuration;
    TrafficLight(String name, int greenSec) { roadName=name; greenDuration=greenSec; }
    void setSignal(Signal s) { current=s; System.out.println(roadName + ": " + s); }
    Signal getSignal() { return current; }
}

class TrafficController {
    private static TrafficController instance;
    private List<TrafficLight> lights = new ArrayList<>();
    private volatile boolean running = false, emergency = false;
    private ScheduledExecutorService scheduler;

    private TrafficController() {}
    public static synchronized TrafficController getInstance() {
        if (instance==null) instance = new TrafficController();
        return instance;
    }
    public void addLight(TrafficLight l) { lights.add(l); }
    public void triggerEmergency() {
        emergency = true;
        System.out.println("EMERGENCY: All RED");
        lights.forEach(l -> l.setSignal(Signal.RED));
    }
    public void clearEmergency() { emergency = false; System.out.println("Emergency cleared"); }
    public void start() {
        running = true;
        scheduler = Executors.newSingleThreadScheduledExecutor();
        new Thread(() -> {
            int idx = 0;
            while (running) {
                try {
                    if (emergency) { Thread.sleep(1000); continue; }
                    final int cur = idx;
                    for (int i=0; i<lights.size(); i++)
                        lights.get(i).setSignal(i==cur ? Signal.GREEN : Signal.RED);
                    Thread.sleep(lights.get(idx).greenDuration * 1000L);
                    lights.get(idx).setSignal(Signal.YELLOW);
                    Thread.sleep(5000);
                    idx = (idx+1) % lights.size();
                } catch (InterruptedException e) { break; }
            }
        }).start();
    }
    public void stop() { running = false; }
}

public class Main {
    public static void main(String[] args) throws Exception {
        TrafficController tc = TrafficController.getInstance();
        tc.addLight(new TrafficLight("North-South", 3));
        tc.addLight(new TrafficLight("East-West", 3));
        tc.start();
        Thread.sleep(8000);
        tc.triggerEmergency();
        Thread.sleep(2000);
        tc.clearEmergency();
        Thread.sleep(4000);
        tc.stop();
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <thread>
#include <chrono>
#include <mutex>
#include <atomic>
using namespace std;

enum class Signal { RED, YELLOW, GREEN };
string signalName(Signal s) {
    if (s==Signal::RED) return "RED";
    if (s==Signal::YELLOW) return "YELLOW";
    return "GREEN";
}

class TrafficLight {
public:
    string roadName; Signal current = Signal::RED; int greenDuration;
    TrafficLight(string name, int sec) : roadName(name), greenDuration(sec) {}
    void setSignal(Signal s) { current=s; cout << roadName << ": " << signalName(s) << endl; }
};

class TrafficController {
    static TrafficController* instance;
    static mutex instanceMutex;
    vector<TrafficLight*> lights;
    atomic<bool> running{false}, emergency{false};
    TrafficController() {}
public:
    static TrafficController* getInstance() {
        if (!instance) {
            lock_guard<mutex> lock(instanceMutex);
            if (!instance) instance = new TrafficController();
        }
        return instance;
    }
    void addLight(TrafficLight* l) { lights.push_back(l); }
    void triggerEmergency() {
        emergency = true;
        cout << "EMERGENCY: All RED\\n";
        for (auto l : lights) l->setSignal(Signal::RED);
    }
    void clearEmergency() { emergency = false; cout << "Emergency cleared\\n"; }
    void start() {
        running = true;
        thread([this]() {
            int idx = 0;
            while (running) {
                if (emergency) { this_thread::sleep_for(chrono::seconds(1)); continue; }
                for (int i=0; i<(int)lights.size(); i++)
                    lights[i]->setSignal(i==idx ? Signal::GREEN : Signal::RED);
                this_thread::sleep_for(chrono::seconds(lights[idx]->greenDuration));
                lights[idx]->setSignal(Signal::YELLOW);
                this_thread::sleep_for(chrono::seconds(5));
                idx = (idx+1) % lights.size();
            }
        }).detach();
    }
    void stop() { running = false; }
};
TrafficController* TrafficController::instance = nullptr;
mutex TrafficController::instanceMutex;

int main() {
    auto tc = TrafficController::getInstance();
    tc->addLight(new TrafficLight("North-South", 3));
    tc->addLight(new TrafficLight("East-West", 3));
    tc->start();
    this_thread::sleep_for(chrono::seconds(8));
    tc->triggerEmergency();
    this_thread::sleep_for(chrono::seconds(2));
    tc->clearEmergency();
    this_thread::sleep_for(chrono::seconds(4));
    tc->stop();
    return 0;
}`,
      typescript: `enum Signal { RED = "RED", YELLOW = "YELLOW", GREEN = "GREEN" }

class TrafficLight {
  current: Signal = Signal.RED;
  constructor(public roadName: string, public greenDuration: number = 30) {}
  setSignal(s: Signal) { this.current = s; console.log(\`\${this.roadName}: \${s}\`); }
}

class TrafficController {
  private static instance: TrafficController;
  private lights: TrafficLight[] = [];
  private running = false;
  private emergency = false;

  private constructor() {}
  static getInstance(): TrafficController {
    if (!TrafficController.instance) TrafficController.instance = new TrafficController();
    return TrafficController.instance;
  }
  addLight(light: TrafficLight) { this.lights.push(light); }
  triggerEmergency() {
    this.emergency = true;
    console.log("EMERGENCY: All RED");
    this.lights.forEach(l => l.setSignal(Signal.RED));
  }
  clearEmergency() { this.emergency = false; console.log("Emergency cleared"); }

  start() {
    this.running = true;
    let idx = 0;
    const cycle = () => {
      if (!this.running) return;
      if (this.emergency) { setTimeout(cycle, 1000); return; }
      this.lights.forEach((l, i) => l.setSignal(i === idx ? Signal.GREEN : Signal.RED));
      setTimeout(() => {
        this.lights[idx].setSignal(Signal.YELLOW);
        idx = (idx + 1) % this.lights.length;
        setTimeout(cycle, 5000);
      }, this.lights[idx].greenDuration * 1000);
    };
    cycle();
  }
  stop() { this.running = false; }
}

// Demo
const tc = TrafficController.getInstance();
tc.addLight(new TrafficLight("North-South", 3));
tc.addLight(new TrafficLight("East-West", 3));
tc.start();
setTimeout(() => tc.triggerEmergency(), 8000);
setTimeout(() => tc.clearEmergency(), 10000);
setTimeout(() => tc.stop(), 14000);`,
    },
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
    code: {
      python: `import threading
from typing import Dict, List, Callable

class Ingredient:
    def __init__(self, name: str, quantity: int, low_threshold: int = 5):
        self.name = name
        self.quantity = quantity
        self.low_threshold = low_threshold

    def is_sufficient(self, amount: int) -> bool:
        return self.quantity >= amount

    def consume(self, amount: int):
        self.quantity -= amount

    def is_low(self) -> bool:
        return self.quantity <= self.low_threshold

class Coffee:
    def __init__(self, name: str, price: float, recipe: Dict[str, int]):
        self.name = name
        self.price = price
        self.recipe = recipe  # ingredient_name -> quantity

class CoffeeMachine:
    _instance = None
    _lock = threading.Lock()

    def __init__(self):
        self.ingredients: Dict[str, Ingredient] = {
            "water": Ingredient("water", 100),
            "milk": Ingredient("milk", 50),
            "coffee_beans": Ingredient("coffee_beans", 50),
            "sugar": Ingredient("sugar", 50),
        }
        self.menu: Dict[str, Coffee] = {
            "espresso": Coffee("Espresso", 2.50, {"water": 5, "coffee_beans": 3}),
            "cappuccino": Coffee("Cappuccino", 3.50, {"water": 4, "milk": 3, "coffee_beans": 3}),
            "latte": Coffee("Latte", 3.00, {"water": 3, "milk": 5, "coffee_beans": 2}),
        }
        self.observers: List[Callable[[str], None]] = []
        self._op_lock = threading.Lock()

    @staticmethod
    def get_instance():
        if CoffeeMachine._instance is None:
            with CoffeeMachine._lock:
                if CoffeeMachine._instance is None:
                    CoffeeMachine._instance = CoffeeMachine()
        return CoffeeMachine._instance

    def subscribe(self, callback: Callable[[str], None]):
        self.observers.append(callback)

    def _notify(self, msg: str):
        for obs in self.observers:
            obs(msg)

    def display_menu(self):
        print("\\n=== Coffee Menu ===")
        for key, coffee in self.menu.items():
            print(f"  {key}: {coffee.name} - \${coffee.price:.2f}")

    def make_coffee(self, coffee_type: str, payment: float) -> float:
        with self._op_lock:
            if coffee_type not in self.menu:
                raise ValueError(f"Unknown coffee: {coffee_type}")
            coffee = self.menu[coffee_type]
            if payment < coffee.price:
                raise ValueError(f"Insufficient payment. Need \${coffee.price:.2f}")
            for ing_name, amount in coffee.recipe.items():
                if ing_name not in self.ingredients or not self.ingredients[ing_name].is_sufficient(amount):
                    raise Exception(f"Insufficient {ing_name}")
            for ing_name, amount in coffee.recipe.items():
                self.ingredients[ing_name].consume(amount)
                if self.ingredients[ing_name].is_low():
                    self._notify(f"Low {ing_name}: {self.ingredients[ing_name].quantity} remaining")
            print(f"Dispensing {coffee.name}...")
            return payment - coffee.price

# Demo
if __name__ == "__main__":
    machine = CoffeeMachine.get_instance()
    machine.subscribe(lambda msg: print(f"[ALERT] {msg}"))
    machine.display_menu()
    change = machine.make_coffee("espresso", 5.00)
    print(f"Change: \${change:.2f}")
    change = machine.make_coffee("cappuccino", 3.50)
    print(f"Change: \${change:.2f}")`,
      java: `import java.util.*;
import java.util.function.Consumer;

class Ingredient {
    String name; int quantity; int lowThreshold;
    Ingredient(String name, int qty, int low) { this.name=name; quantity=qty; lowThreshold=low; }
    boolean isSufficient(int amt) { return quantity >= amt; }
    void consume(int amt) { quantity -= amt; }
    boolean isLow() { return quantity <= lowThreshold; }
}

class Coffee {
    String name; double price; Map<String, Integer> recipe;
    Coffee(String name, double price, Map<String, Integer> recipe) {
        this.name=name; this.price=price; this.recipe=recipe;
    }
}

class CoffeeMachine {
    private static CoffeeMachine instance;
    Map<String, Ingredient> ingredients = new HashMap<>();
    Map<String, Coffee> menu = new HashMap<>();
    List<Consumer<String>> observers = new ArrayList<>();

    private CoffeeMachine() {
        ingredients.put("water", new Ingredient("water", 100, 10));
        ingredients.put("milk", new Ingredient("milk", 50, 5));
        ingredients.put("coffee_beans", new Ingredient("coffee_beans", 50, 5));
        menu.put("espresso", new Coffee("Espresso", 2.50, Map.of("water",5,"coffee_beans",3)));
        menu.put("cappuccino", new Coffee("Cappuccino", 3.50, Map.of("water",4,"milk",3,"coffee_beans",3)));
        menu.put("latte", new Coffee("Latte", 3.00, Map.of("water",3,"milk",5,"coffee_beans",2)));
    }

    public static synchronized CoffeeMachine getInstance() {
        if (instance==null) instance = new CoffeeMachine();
        return instance;
    }

    public void subscribe(Consumer<String> obs) { observers.add(obs); }
    private void notify(String msg) { observers.forEach(o -> o.accept(msg)); }

    public synchronized double makeCoffee(String type, double payment) {
        Coffee coffee = menu.get(type);
        if (coffee == null) throw new IllegalArgumentException("Unknown coffee");
        if (payment < coffee.price) throw new IllegalArgumentException("Insufficient payment");
        for (Map.Entry<String,Integer> e : coffee.recipe.entrySet()) {
            Ingredient ing = ingredients.get(e.getKey());
            if (ing == null || !ing.isSufficient(e.getValue()))
                throw new RuntimeException("Insufficient " + e.getKey());
        }
        for (Map.Entry<String,Integer> e : coffee.recipe.entrySet()) {
            Ingredient ing = ingredients.get(e.getKey());
            ing.consume(e.getValue());
            if (ing.isLow()) notify("Low " + ing.name + ": " + ing.quantity + " remaining");
        }
        System.out.println("Dispensing " + coffee.name);
        return payment - coffee.price;
    }
}

public class Main {
    public static void main(String[] args) {
        CoffeeMachine m = CoffeeMachine.getInstance();
        m.subscribe(msg -> System.out.println("[ALERT] " + msg));
        double change = m.makeCoffee("espresso", 5.00);
        System.out.printf("Change: $%.2f%n", change);
        change = m.makeCoffee("cappuccino", 3.50);
        System.out.printf("Change: $%.2f%n", change);
    }
}`,
      cpp: `#include <iostream>
#include <unordered_map>
#include <vector>
#include <functional>
#include <stdexcept>
#include <mutex>
using namespace std;

struct Ingredient {
    string name; int quantity; int lowThreshold;
    bool isSufficient(int amt) { return quantity >= amt; }
    void consume(int amt) { quantity -= amt; }
    bool isLow() { return quantity <= lowThreshold; }
};

struct Coffee {
    string name; double price;
    unordered_map<string, int> recipe;
};

class CoffeeMachine {
    static CoffeeMachine* instance;
    static mutex instanceMutex;
    unordered_map<string, Ingredient> ingredients;
    unordered_map<string, Coffee> menu;
    vector<function<void(string)>> observers;
    mutex opMutex;

    CoffeeMachine() {
        ingredients["water"] = {"water", 100, 10};
        ingredients["milk"] = {"milk", 50, 5};
        ingredients["coffee_beans"] = {"coffee_beans", 50, 5};
        menu["espresso"] = {"Espresso", 2.50, {{"water",5},{"coffee_beans",3}}};
        menu["cappuccino"] = {"Cappuccino", 3.50, {{"water",4},{"milk",3},{"coffee_beans",3}}};
        menu["latte"] = {"Latte", 3.00, {{"water",3},{"milk",5},{"coffee_beans",2}}};
    }
public:
    static CoffeeMachine* getInstance() {
        if (!instance) {
            lock_guard<mutex> lock(instanceMutex);
            if (!instance) instance = new CoffeeMachine();
        }
        return instance;
    }
    void subscribe(function<void(string)> obs) { observers.push_back(obs); }
    void notify(const string& msg) { for (auto& o : observers) o(msg); }

    double makeCoffee(const string& type, double payment) {
        lock_guard<mutex> lock(opMutex);
        auto it = menu.find(type);
        if (it == menu.end()) throw invalid_argument("Unknown coffee");
        Coffee& coffee = it->second;
        if (payment < coffee.price) throw invalid_argument("Insufficient payment");
        for (auto& [ing, amt] : coffee.recipe) {
            if (!ingredients[ing].isSufficient(amt)) throw runtime_error("Insufficient " + ing);
        }
        for (auto& [ing, amt] : coffee.recipe) {
            ingredients[ing].consume(amt);
            if (ingredients[ing].isLow()) notify("Low " + ing + ": " + to_string(ingredients[ing].quantity));
        }
        cout << "Dispensing " << coffee.name << endl;
        return payment - coffee.price;
    }
};
CoffeeMachine* CoffeeMachine::instance = nullptr;
mutex CoffeeMachine::instanceMutex;

int main() {
    auto m = CoffeeMachine::getInstance();
    m->subscribe([](string msg) { cout << "[ALERT] " << msg << endl; });
    double change = m->makeCoffee("espresso", 5.00);
    cout << "Change: $" << change << endl;
    change = m->makeCoffee("cappuccino", 3.50);
    cout << "Change: $" << change << endl;
    return 0;
}`,
      typescript: `type Observer = (msg: string) => void;

class Ingredient {
  constructor(public name: string, public quantity: number, public lowThreshold: number = 5) {}
  isSufficient(amt: number): boolean { return this.quantity >= amt; }
  consume(amt: number): void { this.quantity -= amt; }
  isLow(): boolean { return this.quantity <= this.lowThreshold; }
}

class Coffee {
  constructor(
    public name: string,
    public price: number,
    public recipe: Record<string, number>
  ) {}
}

class CoffeeMachine {
  private static instance: CoffeeMachine;
  private ingredients: Record<string, Ingredient>;
  private menu: Record<string, Coffee>;
  private observers: Observer[] = [];

  private constructor() {
    this.ingredients = {
      water: new Ingredient("water", 100, 10),
      milk: new Ingredient("milk", 50, 5),
      coffee_beans: new Ingredient("coffee_beans", 50, 5),
    };
    this.menu = {
      espresso: new Coffee("Espresso", 2.50, { water: 5, coffee_beans: 3 }),
      cappuccino: new Coffee("Cappuccino", 3.50, { water: 4, milk: 3, coffee_beans: 3 }),
      latte: new Coffee("Latte", 3.00, { water: 3, milk: 5, coffee_beans: 2 }),
    };
  }

  static getInstance(): CoffeeMachine {
    if (!CoffeeMachine.instance) CoffeeMachine.instance = new CoffeeMachine();
    return CoffeeMachine.instance;
  }

  subscribe(obs: Observer) { this.observers.push(obs); }
  private notify(msg: string) { this.observers.forEach(o => o(msg)); }

  displayMenu() {
    console.log("=== Coffee Menu ===");
    Object.entries(this.menu).forEach(([k, c]) =>
      console.log(\`  \${k}: \${c.name} - $\${c.price.toFixed(2)}\`));
  }

  makeCoffee(type: string, payment: number): number {
    const coffee = this.menu[type];
    if (!coffee) throw new Error(\`Unknown coffee: \${type}\`);
    if (payment < coffee.price) throw new Error("Insufficient payment");
    for (const [ing, amt] of Object.entries(coffee.recipe)) {
      if (!this.ingredients[ing]?.isSufficient(amt))
        throw new Error(\`Insufficient \${ing}\`);
    }
    for (const [ing, amt] of Object.entries(coffee.recipe)) {
      this.ingredients[ing].consume(amt);
      if (this.ingredients[ing].isLow())
        this.notify(\`Low \${ing}: \${this.ingredients[ing].quantity} remaining\`);
    }
    console.log(\`Dispensing \${coffee.name}...\`);
    return payment - coffee.price;
  }
}

// Demo
const machine = CoffeeMachine.getInstance();
machine.subscribe(msg => console.log(\`[ALERT] \${msg}\`));
machine.displayMenu();
let change = machine.makeCoffee("espresso", 5.00);
console.log(\`Change: $\${change.toFixed(2)}\`);`,
    },
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
    code: {
      python: `import threading
import uuid
from enum import Enum
from datetime import datetime
from typing import List, Dict, Optional

class TaskStatus(Enum):
    TODO = "TODO"
    IN_PROGRESS = "IN_PROGRESS"
    DONE = "DONE"

class TaskPriority(Enum):
    LOW = 1
    MEDIUM = 2
    HIGH = 3

class User:
    def __init__(self, name: str, email: str):
        self.user_id = str(uuid.uuid4())
        self.name = name
        self.email = email

class Task:
    def __init__(self, title: str, description: str, priority: TaskPriority,
                 due_date: datetime, creator: User):
        self.task_id = str(uuid.uuid4())
        self.title = title
        self.description = description
        self.priority = priority
        self.due_date = due_date
        self.status = TaskStatus.TODO
        self.creator = creator
        self.assignee: Optional[User] = None
        self.created_at = datetime.now()
        self.history: List[str] = []

    def assign(self, user: User):
        self.assignee = user
        self.history.append(f"Assigned to {user.name}")

    def update_status(self, status: TaskStatus):
        self.history.append(f"Status changed from {self.status.value} to {status.value}")
        self.status = status

class TaskManager:
    _instance = None
    _lock = threading.Lock()

    def __init__(self):
        self.tasks: Dict[str, Task] = {}
        self.users: Dict[str, User] = {}
        self._data_lock = threading.Lock()

    @staticmethod
    def get_instance():
        if TaskManager._instance is None:
            with TaskManager._lock:
                if TaskManager._instance is None:
                    TaskManager._instance = TaskManager()
        return TaskManager._instance

    def create_user(self, name: str, email: str) -> User:
        user = User(name, email)
        with self._data_lock:
            self.users[user.user_id] = user
        return user

    def create_task(self, title: str, desc: str, priority: TaskPriority,
                    due: datetime, creator: User) -> Task:
        task = Task(title, desc, priority, due, creator)
        with self._data_lock:
            self.tasks[task.task_id] = task
        return task

    def delete_task(self, task_id: str):
        with self._data_lock:
            self.tasks.pop(task_id, None)

    def get_tasks_by_priority(self, priority: TaskPriority) -> List[Task]:
        with self._data_lock:
            return [t for t in self.tasks.values() if t.priority == priority]

    def get_tasks_by_user(self, user: User) -> List[Task]:
        with self._data_lock:
            return [t for t in self.tasks.values() if t.assignee == user]

# Demo
if __name__ == "__main__":
    manager = TaskManager.get_instance()
    alice = manager.create_user("Alice", "alice@ex.com")
    bob = manager.create_user("Bob", "bob@ex.com")
    task = manager.create_task("Build API", "REST API for users", TaskPriority.HIGH,
                               datetime(2025, 12, 31), alice)
    task.assign(bob)
    task.update_status(TaskStatus.IN_PROGRESS)
    print(f"Task: {task.title}, Status: {task.status.value}, Assignee: {task.assignee.name}")
    print(f"History: {task.history}")`,
      java: `import java.util.*;
import java.util.stream.*;

enum TaskStatus { TODO, IN_PROGRESS, DONE }
enum TaskPriority { LOW, MEDIUM, HIGH }

class User {
    String userId = UUID.randomUUID().toString(), name, email;
    User(String name, String email) { this.name=name; this.email=email; }
}

class Task {
    String taskId = UUID.randomUUID().toString(), title, description;
    TaskPriority priority; TaskStatus status = TaskStatus.TODO;
    User creator, assignee;
    Date dueDate; List<String> history = new ArrayList<>();
    Task(String title, String desc, TaskPriority priority, Date due, User creator) {
        this.title=title; this.description=desc; this.priority=priority; dueDate=due; this.creator=creator;
    }
    void assign(User u) { assignee=u; history.add("Assigned to "+u.name); }
    void updateStatus(TaskStatus s) {
        history.add("Status: "+status+" -> "+s); status=s;
    }
}

class TaskManager {
    private static TaskManager instance;
    Map<String, Task> tasks = new HashMap<>();
    Map<String, User> users = new HashMap<>();
    private TaskManager() {}
    public static synchronized TaskManager getInstance() {
        if (instance==null) instance = new TaskManager();
        return instance;
    }
    public User createUser(String name, String email) {
        User u = new User(name, email);
        users.put(u.userId, u); return u;
    }
    public synchronized Task createTask(String title, String desc, TaskPriority priority, Date due, User creator) {
        Task t = new Task(title, desc, priority, due, creator);
        tasks.put(t.taskId, t); return t;
    }
    public synchronized void deleteTask(String taskId) { tasks.remove(taskId); }
    public List<Task> getByPriority(TaskPriority priority) {
        return tasks.values().stream().filter(t -> t.priority==priority).collect(Collectors.toList());
    }
    public List<Task> getByUser(User user) {
        return tasks.values().stream().filter(t -> user.equals(t.assignee)).collect(Collectors.toList());
    }
}

public class Main {
    public static void main(String[] args) {
        TaskManager tm = TaskManager.getInstance();
        User alice = tm.createUser("Alice", "alice@ex.com");
        User bob = tm.createUser("Bob", "bob@ex.com");
        Task t = tm.createTask("Build API", "REST API", TaskPriority.HIGH, new Date(), alice);
        t.assign(bob); t.updateStatus(TaskStatus.IN_PROGRESS);
        System.out.println("Task: " + t.title + ", Status: " + t.status + ", Assignee: " + t.assignee.name);
    }
}`,
      cpp: `#include <iostream>
#include <unordered_map>
#include <vector>
#include <mutex>
#include <algorithm>
using namespace std;

enum class TaskStatus { TODO, IN_PROGRESS, DONE };
enum class TaskPriority { LOW, MEDIUM, HIGH };

struct User {
    string userId, name, email;
};

struct Task {
    string taskId, title, description;
    TaskPriority priority; TaskStatus status = TaskStatus::TODO;
    User* creator; User* assignee = nullptr;
    vector<string> history;
    void assign(User* u) { assignee=u; history.push_back("Assigned to "+u->name); }
    void updateStatus(TaskStatus s) {
        history.push_back("Status changed"); status=s;
    }
};

class TaskManager {
    static TaskManager* instance;
    static mutex instanceMutex;
    unordered_map<string, Task> tasks;
    unordered_map<string, User> users;
    mutex dataMutex;
    int idCounter = 0;
    TaskManager() {}
public:
    static TaskManager* getInstance() {
        if (!instance) {
            lock_guard<mutex> lock(instanceMutex);
            if (!instance) instance = new TaskManager();
        }
        return instance;
    }
    User* createUser(const string& name, const string& email) {
        string id = "u" + to_string(++idCounter);
        users[id] = {id, name, email};
        return &users[id];
    }
    Task* createTask(const string& title, const string& desc,
                     TaskPriority priority, User* creator) {
        lock_guard<mutex> lock(dataMutex);
        string id = "t" + to_string(++idCounter);
        tasks[id] = {id, title, desc, priority, TaskStatus::TODO, creator};
        return &tasks[id];
    }
    vector<Task*> getByPriority(TaskPriority p) {
        vector<Task*> result;
        for (auto& [id, t] : tasks) if (t.priority == p) result.push_back(&t);
        return result;
    }
};
TaskManager* TaskManager::instance = nullptr;
mutex TaskManager::instanceMutex;

int main() {
    auto tm = TaskManager::getInstance();
    User* alice = tm->createUser("Alice", "alice@ex.com");
    User* bob = tm->createUser("Bob", "bob@ex.com");
    Task* t = tm->createTask("Build API", "REST API", TaskPriority::HIGH, alice);
    t->assign(bob); t->updateStatus(TaskStatus::IN_PROGRESS);
    cout << "Task: " << t->title << ", Assignee: " << t->assignee->name << endl;
    return 0;
}`,
      typescript: `enum TaskStatus { TODO = "TODO", IN_PROGRESS = "IN_PROGRESS", DONE = "DONE" }
enum TaskPriority { LOW = 1, MEDIUM = 2, HIGH = 3 }

class User {
  userId = Math.random().toString(36).slice(2);
  constructor(public name: string, public email: string) {}
}

class Task {
  taskId = Math.random().toString(36).slice(2);
  status: TaskStatus = TaskStatus.TODO;
  assignee: User | null = null;
  history: string[] = [];
  createdAt = new Date();

  constructor(
    public title: string, public description: string,
    public priority: TaskPriority, public dueDate: Date, public creator: User
  ) {}

  assign(user: User) {
    this.assignee = user;
    this.history.push(\`Assigned to \${user.name}\`);
  }

  updateStatus(status: TaskStatus) {
    this.history.push(\`Status: \${this.status} -> \${status}\`);
    this.status = status;
  }
}

class TaskManager {
  private static instance: TaskManager;
  private tasks = new Map<string, Task>();
  private users = new Map<string, User>();

  private constructor() {}
  static getInstance(): TaskManager {
    if (!TaskManager.instance) TaskManager.instance = new TaskManager();
    return TaskManager.instance;
  }
  createUser(name: string, email: string): User {
    const u = new User(name, email);
    this.users.set(u.userId, u); return u;
  }
  createTask(title: string, desc: string, priority: TaskPriority,
             dueDate: Date, creator: User): Task {
    const t = new Task(title, desc, priority, dueDate, creator);
    this.tasks.set(t.taskId, t); return t;
  }
  deleteTask(taskId: string) { this.tasks.delete(taskId); }
  getByPriority(priority: TaskPriority): Task[] {
    return [...this.tasks.values()].filter(t => t.priority === priority);
  }
  getByUser(user: User): Task[] {
    return [...this.tasks.values()].filter(t => t.assignee === user);
  }
}

// Demo
const tm = TaskManager.getInstance();
const alice = tm.createUser("Alice", "alice@ex.com");
const bob = tm.createUser("Bob", "bob@ex.com");
const task = tm.createTask("Build API", "REST API", TaskPriority.HIGH, new Date("2025-12-31"), alice);
task.assign(bob); task.updateStatus(TaskStatus.IN_PROGRESS);
console.log(\`Task: \${task.title}, Status: \${task.status}, Assignee: \${task.assignee?.name}\`);
console.log("History:", task.history);`,
    },
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
