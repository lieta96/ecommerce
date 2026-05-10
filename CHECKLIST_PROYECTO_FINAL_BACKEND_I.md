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

- [x] **`limit`** (cantidad de resultados)
- [x] **`page`** (paginación)
- [x] **`query`** (filtro por categoría o disponibilidad)
- [x] **`sort`** (orden ascendente o descendente por precio)

**Valores por defecto:**

- [x] `limit = 10`
- [x] `page = 1`

**Formato de respuesta esperado:**

- [x] El cuerpo de la respuesta sigue esta estructura (con `payload` paginado y metadatos de navegación):

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

- [x] Obtener un producto por ID.

### `POST /api/products`

- [x] Crear producto con los siguientes campos:
  - `title`
  - `description`
  - `code`
  - `price`
  - `status`
  - `stock`
  - `category`
  - `thumbnails`
- [x] El **ID** debe generarse automáticamente.

### `PUT /api/products/:pid`

- [x] Actualizar producto existente.
- [x] No se debe modificar el **ID**.

### `DELETE /api/products/:pid`

- [x] Eliminar producto.

---

## 3. Gestión de carritos

### `POST /api/carts`

- [x] Crear carrito con **ID autogenerado**.

### `GET /api/carts/:cid`

- [x] Listar productos del carrito.
- [x] Utilizar **`populate`** para traer información completa de los productos.

### `POST /api/carts/:cid/products/:pid`

- [x] Agregar producto al carrito.
- [x] Si el producto ya existe en el carrito, **incrementar la cantidad**.

### `DELETE /api/carts/:cid/products/:pid`

- [x] Eliminar producto del carrito.

### `PUT /api/carts/:cid`

- [x] Actualizar **todos** los productos del carrito.

### `PUT /api/carts/:cid/products/:pid`

- [x] Actualizar **únicamente la cantidad** de un producto.

### `DELETE /api/carts/:cid`

- [x] **Vaciar** el carrito completo.

---

## 4. Persistencia

- [x] Implementar **MongoDB** con **Mongoose**.
- [x] Base de datos: **`ecommerce`**.
- [x] Colecciones:
  - [x] `products`
  - [x] `carts`

**Estructura del proyecto:**

- [x] Mantener carpeta **`dao`**.
- [x] Mantener carpeta **`models`**.
- [x] **No eliminar** la implementación previa con **FileSystem**.

---

## 5. Vistas y tiempo real

### Rutas de vistas

- [x] **`/products`** — Listado de productos con paginación.
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
