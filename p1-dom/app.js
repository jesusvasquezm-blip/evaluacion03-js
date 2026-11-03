let pedidos = [];

function crearPedido(id, producto, precio, cantidad) {
  return {
    id,
    producto,
    precio: parseFloat(precio),
    cantidad: parseInt(cantidad, 10),
    estado: 'pendiente',
    subtotal() {
      return this.precio * this.cantidad;
    },
    marcarEntregado() {
      this.estado = 'entregado';
    }
  };
}

const formPedido = document.getElementById('form-pedido');
const inputProducto = document.getElementById('producto');
const inputPrecio = document.getElementById('precio');
const inputCantidad = document.getElementById('cantidad');
const elMensaje = document.getElementById('mensaje');
const selectFiltro = document.getElementById('filtro');
const listaPedidos = document.getElementById('lista-pedidos');
const elTotal = document.getElementById('total');

function render() {
  listaPedidos.innerHTML = '';
  const filtroActual = selectFiltro.value;

  const pedidosFiltrados = pedidos.filter(p => {
    if (filtroActual === 'todos') return true;
    return p.estado === filtroActual;
  });

  pedidosFiltrados.forEach(pedido => {
    const li = document.createElement('li');
    li.setAttribute('data-id', pedido.id);

    const spanInfo = document.createElement('span');
    spanInfo.innerHTML = `${pedido.producto} - S/ ${pedido.precio.toFixed(2)} x ${pedido.cantidad} = S/ ${pedido.subtotal().toFixed(2)} [${pedido.estado}] `;
    li.appendChild(spanInfo);

    if (pedido.estado === 'pendiente') {
      const btnEntregar = document.createElement('button');
      btnEntregar.textContent = 'Entregar';
      btnEntregar.classList.add('btn-entregar');
      li.appendChild(btnEntregar);
    }

    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.classList.add('btn-eliminar');
    li.appendChild(btnEliminar);

    listaPedidos.appendChild(li);
  });

  const sumaTotal = pedidos.reduce((acc, p) => acc + p.subtotal(), 0);
  elTotal.textContent = `Total a cobrar: S/ ${sumaTotal.toFixed(2)}`;
}

formPedido.addEventListener('submit', (e) => {
  e.preventDefault();
  elMensaje.textContent = '';

  const prodVal = inputProducto.value.trim();
  const precVal = parseFloat(inputPrecio.value);
  const cantVal = parseInt(inputCantidad.value, 10);

  if (!prodVal) {
    elMensaje.textContent = 'El nombre del producto no puede estar vacío.';
    return;
  }
  if (isNaN(precVal) || precVal <= 0) {
    elMensaje.textContent = 'El precio debe ser un número mayor a 0.';
    return;
  }
  if (isNaN(cantVal) || cantVal < 0) {
    elMensaje.textContent = 'La cantidad no puede ser negativa.';
    return;
  }

  const nuevoPedido = crearPedido(Date.now(), prodVal, precVal, cantVal);
  pedidos.push(nuevoPedido);

  formPedido.reset();
  render();
});

listaPedidos.addEventListener('click', (e) => {
  const li = e.target.closest('li');
  if (!li) return;

  const id = Number(li.getAttribute('data-id'));
  const pedido = pedidos.find(p => p.id === id);

  if (e.target.classList.contains('btn-entregar')) {
    if (pedido) pedido.marcarEntregado();
  } else if (e.target.classList.contains('btn-eliminar')) {
    pedidos = pedidos.filter(p => p.id !== id);
  }

  render();
});

selectFiltro.addEventListener('change', render);