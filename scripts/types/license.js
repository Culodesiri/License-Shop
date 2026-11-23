const currencyFormatter = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });
const INSTALL_DURATION_MS = 1500;

// A software license displayed as a floppy disk that can be bought.
export class License {
  constructor(id, software, version, price, key, featured, discount, category = '', image = '') {
    this.id = id;
    this.software = software;
    this.version = version;
    this.price = price;
    this.key = key;
    this.featured = featured;
    this.discount = discount;
    this.category = category;
    this.image = image;
  }

  get hasDiscount() { return this.discount > 0; }
  get finalPrice() { return this.price * (1 - this.discount / 100); }

  Render(parent) {
    const disk = document.createElement('article');
    disk.className = `disk disk-${this.category.toLowerCase()}`;
    disk.innerHTML = `
      ${this.featured ? '<span class="sticker featured">★ TOP</span>' : ''}
      ${this.hasDiscount ? `<span class="sticker discount">-${this.discount}%</span>` : ''}
      <div class="shutter"></div>
      <div class="label">
        <img src="${this.image}" alt="Icono de ${this.software}" loading="lazy">
        <strong>${this.software}</strong>
        <small>v${this.version}</small>
      </div>
      <div class="disk-footer">
        <span class="category">${this.category}</span>
        <span class="prices">
          ${this.hasDiscount ? `<s>${currencyFormatter.format(this.price)}</s>` : ''}
          <strong>${currencyFormatter.format(this.finalPrice)}</strong>
        </span>
      </div>
      <button class="buy-button">Comprar</button>`;
    disk.querySelector('.buy-button').addEventListener('click', () => this.Buy());
    parent.appendChild(disk);
    return disk;
  }

  // Opens an installer-like window that reveals the license key once the "installation" ends.
  Buy() {
    const dialog = document.createElement('dialog');
    dialog.className = 'window key-window';
    dialog.innerHTML = `
      <div class="title-bar">
        <span>💾 Instalador.exe</span>
        <button class="close-button" aria-label="Cerrar">✕</button>
      </div>
      <div class="window-body">
        <p><strong>${this.software}</strong> v${this.version}</p>
        <div class="installing">
          <div class="progress"><div class="progress-bar"></div></div>
          <p>Procesando pago e instalando licencia...</p>
        </div>
        <div class="key-result" hidden>
          <p>¡Instalación completada! Tu clave de licencia:</p>
          <code>${this.key}</code>
          <button class="copy-button">Copiar clave</button>
        </div>
      </div>`;
    dialog.querySelector('.close-button').addEventListener('click', () => dialog.close());
    dialog.querySelector('.copy-button').addEventListener('click', (event) => {
      navigator.clipboard?.writeText(this.key);
      event.target.textContent = '¡Copiada!';
    });
    dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => dialog.remove());
    document.body.appendChild(dialog);
    dialog.showModal();

    setTimeout(() => {
      dialog.querySelector('.installing').hidden = true;
      dialog.querySelector('.key-result').hidden = false;
    }, INSTALL_DURATION_MS);
  }
}
