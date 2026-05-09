# Proyecto final — Backend I (Coderhouse)

Este documento describe el proyecto de entrega final de la cursada **Backend I** de **Coderhouse**: una versión final del desarrollo iniciado durante la cursada que debe cumplir los requisitos listados más abajo. 

---

## 1. Servidor

- [x] Implementar un servidor con **Node.js** y **Express**.
- [x] El servidor debe ejecutarse en el puerto **8080**.
- [x] Organizar las rutas en:
  - [x] `/api/products`
  - [x] `/api/carts`

---

## 2. Gestión de productos

### `GET /api/products`

Debe permitir:

- [ ] **`limit`** (cantidad de resultados)
- [ ] **`page`** (paginación)
- [ ] **`query`** (filtro por categoría o disponibilidad)
- [ ] **`sort`** (orden ascendente o descendente por precio)

**Valores por defecto:**

- [ ] `limit = 10`
- [ ] `page = 1`

**Formato de respuesta esperado:**

- [ ] El cuerpo de la respuesta sigue esta estructura (con `payload` paginado y metadatos de navegación):

```json
{
  "status": "success",
  "payload": [],
  "totalPages": 0,
  "prevPage": null,
  "nextPage": null,
  "page": 1,
  "hasPrevPage": false,
  "hasNextPage": false,
  "prevLink": null,
  "nextLink": null
}
```

### `GET /api/products/:pid`

- [ ] Obtener un producto por ID.

### `POST /api/products`

- [ ] Crear producto con los siguientes campos:
  - `title`
  - `description`
  - `code`
  - `price`
  - `status`
  - `stock`
  - `category`
  - `thumbnails`
- [ ] El **ID** debe generarse automáticamente.

### `PUT /api/products/:pid`

- [ ] Actualizar producto existente.
- [ ] No se debe modificar el **ID**.

### `DELETE /api/products/:pid`

- [ ] Eliminar producto.

---

## 3. Gestión de carritos

### `POST /api/carts`

- [ ] Crear carrito con **ID autogenerado**.

### `GET /api/carts/:cid`

- [ ] Listar productos del carrito.
- [ ] Utilizar **`populate`** para traer información completa de los productos.

### `POST /api/carts/:cid/products/:pid`

- [ ] Agregar producto al carrito.
- [ ] Si el producto ya existe en el carrito, **incrementar la cantidad**.

### `DELETE /api/carts/:cid/products/:pid`

- [ ] Eliminar producto del carrito.

### `PUT /api/carts/:cid`

- [ ] Actualizar **todos** los productos del carrito.

### `PUT /api/carts/:cid/products/:pid`

- [ ] Actualizar **únicamente la cantidad** de un producto.

### `DELETE /api/carts/:cid`

- [ ] **Vaciar** el carrito completo.

---

## 4. Persistencia

- [ ] Implementar **MongoDB** con **Mongoose**.
- [ ] Base de datos: **`ecommerce`**.
- [ ] Colecciones:
  - [ ] `products`
  - [ ] `carts`

**Estructura del proyecto:**

- [ ] Mantener carpeta **`dao`**.
- [ ] Mantener carpeta **`models`**.
- [ ] **No eliminar** la implementación previa con **FileSystem**.

---

## 5. Vistas y tiempo real

### Rutas de vistas

- [ ] **`/products`** — Listado de productos con paginación.
- [ ] **`/products/:pid`** — Vista de detalle del producto, con opción para agregar al carrito.
- [ ] **`/carts/:cid`** — Visualización de un carrito específico.

### WebSockets

- [ ] Implementar actualización **en tiempo real** de productos.
- [ ] Los cambios deben reflejarse **automáticamente** en la vista.

---

## Requisitos técnicos generales

- [ ] Uso de **Express Router**.
- [ ] Uso de **middleware**.
- [ ] Manejo de asincronía con **`async` / `await`**.
- [ ] Uso de **Mongoose**.
- [ ] Código **modular y organizado**.
- [ ] Manejo **básico de errores**.

---

*Última actualización del checklist: según consignas del proyecto final Backend I (Coderhouse).*
