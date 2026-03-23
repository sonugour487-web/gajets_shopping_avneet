import Array "mo:core/Array";
import List "mo:core/List";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

import Runtime "mo:core/Runtime";


actor {
  type Product = {
    id : Nat;
    name : Text;
    description : Text;
    price : Nat;
    stock : Nat;
  };

  let products = Map.empty<Nat, Product>();
  var nextProductId = 0;

  type Order = {
    id : Nat;
    buyer : Principal;
    productIds : [Nat];
    totalAmount : Nat;
    timestamp : Time.Time;
    phone : Text;
    paymentMethod : Text;
    deliveryCharge : Nat;
    deliveryDate : Text;
  };

  var nextOrderId = 0;
  let orders = Map.empty<Nat, Order>();

  // *** Product CRUD ***

  // Get all products.
  public query ({ caller }) func getProducts() : async [Product] {
    products.values().toArray();
  };

  // Get a specific product.
  public query ({ caller }) func getProduct(id : Nat) : async ?Product {
    products.get(id);
  };

  // Add a single product.
  public shared ({ caller }) func addProduct(name : Text, description : Text, price : Nat, stock : Nat) : async Nat {
    if (price < 1000) { Runtime.trap("Price cannot be less than 1000") };

    let product = {
      id = nextProductId;
      name;
      description;
      price;
      stock;
    };
    products.add(nextProductId, product);
    nextProductId += 1;
    product.id;
  };

  // Add multiple products at once.
  public shared ({ caller }) func bulkAddProducts(newProducts : [(Text, Text, Nat, Nat)]) : async [Nat] {
    let idList = List.empty<Nat>();

    for ((name, description, price, stock) in newProducts.values()) {
      if (price < 1000) { Runtime.trap("Price cannot be less than 1000") };

      let product = {
        id = nextProductId;
        name;
        description;
        price;
        stock;
      };
      products.add(nextProductId, product);
      idList.add(nextProductId);
      nextProductId += 1;
    };

    idList.toArray();
  };

  // *** Order Handling ***

  // Create an order (never fails).
  public shared ({ caller }) func createOrder(
    productIds : [Nat],
    phone : Text,
    paymentMethod : Text,
    deliveryCharge : Nat,
    deliveryDate : Text,
  ) : async Nat {
    var totalAmount = 0;

    for (productId in productIds.values()) {
      switch (products.get(productId)) {
        case (?product) {
          products.add(productId, { product with stock = product.stock - 1 });
          totalAmount += product.price;
        };
        case (null) { () };
      };
    };

    let order = {
      id = nextOrderId;
      buyer = caller;
      productIds;
      totalAmount;
      timestamp = Time.now();
      phone;
      paymentMethod;
      deliveryCharge;
      deliveryDate;
    };

    orders.add(nextOrderId, order);
    nextOrderId += 1;
    order.id;
  };

  // Get a specific order.
  public query ({ caller }) func getOrder(id : Nat) : async ?Order {
    orders.get(id);
  };

  // Get all orders for a given buyer.
  public query ({ caller }) func getOrdersByBuyer(buyer : Principal) : async [Order] {
    let buyerOrders = orders.values().toArray().filter(
      func(order) { order.buyer == buyer }
    );
    buyerOrders;
  };
};
