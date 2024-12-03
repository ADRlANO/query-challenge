import { createAsync } from "@solidjs/router";
import { Suspense } from "solid-js";

import { query } from "~/lib/db";

export default function Query() {
  const query_result = createAsync(() => queryDB());
  const users = createAsync(() => fetchUsers());
  const products = createAsync(() => fetchProducts());
  const orders = createAsync(() => fetchOrders());

  return (
    <Suspense fallback={"Loading..."}>
      <div>
        <h2>Query Result: </h2>
        <code>
          query that returns a list of all users who have made at least 3 orders
          in the "Electronics" category and have spent more than $1000 on those
          orders, sorted by the total amount they have spent in descending
          order. The output should include the user's name, email, and the total
          amount they have spent on "Electronics" orders
        </code>
        <pre>{JSON.stringify(query_result(), null, 2)}</pre>
      </div>
      <div>
        <h2>Users: </h2>
        <pre>{JSON.stringify(users(), null, 2)}</pre>
      </div>
      <div>
        <h2>Products: </h2>
        <pre>{JSON.stringify(products(), null, 2)}</pre>
      </div>
      <div>
        <h2>Orders: </h2>
        <pre>{JSON.stringify(orders(), null, 2)}</pre>
      </div>
    </Suspense>
  );
}

async function fetchUsers() {
  "use server";

  const users = await query.sql`SELECT * FROM users`;
  return users.records;
}

async function fetchProducts() {
  "use server";

  const products = await query.sql`SELECT * FROM products`;
  return products.records;
}

async function fetchOrders() {
  "use server";

  const orders = await query.sql`SELECT * FROM orders`;
  return orders.records;
}

const queryDB = async () => {
  "use server";

  const query_result = await query.sql`
    SELECT 
        u.name AS user_name,
        u.email AS user_email,
        SUM(p.price * o.quantity) AS total_spent
    FROM 
        users u
    JOIN 
        orders o ON u.xata_id = o.user_id
    JOIN 
        products p ON o.product_id = p.xata_id
    WHERE 
        p.category = 'Electronics'
    GROUP BY 
        u.xata_id, u.name, u.email
    HAVING 
        COUNT(o.xata_id) >= 3
        AND SUM(p.price * o.quantity) > 1000
    ORDER BY 
        total_spent DESC;
  `;

  return query_result.records;
};
