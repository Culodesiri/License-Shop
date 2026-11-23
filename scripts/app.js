import { License } from './types/license.js';
import { LicenseController } from './controllers/licenseController.js';

// Loads the data and decides where and in which order each section is rendered.
class App {
  constructor() {
    this.main = document.getElementById('main');
    this.navigation = document.getElementById('navigation');
    this.licenses = [];
    this.controller = null;
  }

  async Initialize() {
    try {
      this.licenses = await this.LoadLicenses();
      this.controller = new LicenseController(this.licenses);
      this.RenderSections();
    } catch (error) {
      console.error(error);
      this.main.innerHTML = '<p class="error">No se pudieron cargar las licencias.</p>';
    }
  }

  async LoadLicenses() {
    const response = await fetch('data/licenses.json');
    const data = await response.json();
    return data.map((item) => new License(
      item.id, item.software, item.version, item.price, item.key,
      item.featured, item.discount, item.category, item.image
    ));
  }

  // The order of this list is the order of the sections on the page.
  RenderSections() {
    const sections = [
      { id: 'all', title: 'Todas las licencias', render: (parent) => this.RenderAllWithFilters(parent) },
      { id: 'offers', title: 'Ofertas', render: (parent) => this.controller.RenderOffers(3, parent) },
      { id: 'featured', title: 'Destacados', render: (parent) => this.controller.RenderFeatured(3, parent) },
      { id: 'latest', title: 'Últimas versiones', render: (parent) => this.controller.RenderLatest(3, parent) }
    ];
    sections.forEach((section) => this.RenderSection(section));
  }

  RenderSection({ id, title, render }) {
    const section = document.createElement('section');
    section.id = id;
    section.innerHTML = `<h2>${title}</h2><div class="grid"></div>`;
    this.main.appendChild(section);
    render(section.querySelector('.grid'));

    const link = document.createElement('a');
    link.href = `#${id}`;
    link.textContent = title;
    this.navigation.appendChild(link);
  }

  RenderAllWithFilters(grid) {
    const filters = { search: '', software: '', category: '', onlyOffers: false };
    const bar = this.CreateFilterBar(filters, () => Refresh());
    const counter = bar.querySelector('.result-count');
    grid.before(bar);

    const Refresh = () => {
      grid.innerHTML = '';
      const total = this.controller.RenderAll(this.licenses.length, grid, filters);
      counter.textContent = `${total} licencias`;
      if (total === 0) grid.innerHTML = '<p class="empty">No hay licencias con esos filtros.</p>';
    };
    Refresh();
  }

  CreateFilterBar(filters, onChange) {
    const bar = document.createElement('div');
    bar.className = 'filters';
    bar.innerHTML = `
      <input type="search" name="search" placeholder="Buscar software o versión...">
      <select name="software"><option value="">Todos los programas</option>${this.BuildOptions('software')}</select>
      <select name="category"><option value="">Todas las categorías</option>${this.BuildOptions('category')}</select>
      <label><input type="checkbox" name="onlyOffers"> Solo ofertas</label>
      <span class="result-count"></span>`;
    bar.addEventListener('input', (event) => {
      const { name, type, checked, value } = event.target;
      filters[name] = type === 'checkbox' ? checked : value;
      onChange();
    });
    return bar;
  }

  BuildOptions(property) {
    return this.controller.GetUniqueValues(property)
      .map((value) => `<option value="${value}">${value}</option>`)
      .join('');
  }
}

new App().Initialize();
