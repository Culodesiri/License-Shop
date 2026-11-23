// Decides which licenses are shown in each section and delegates their drawing to the License type.
export class LicenseController {
  constructor(licenses) {
    this.licenses = licenses;
    // Random order is decided once, so filtering does not reshuffle the cards.
    this.randomOrder = this.Shuffle(licenses);
  }

  RenderFeatured(count, parent) {
    const featured = this.licenses.filter((license) => license.featured);
    this.RenderList(featured.slice(0, count), parent);
  }

  RenderOffers(count, parent) {
    const offers = this.licenses
      .filter((license) => license.hasDiscount)
      .sort((a, b) => b.discount - a.discount);
    this.RenderList(offers.slice(0, count), parent);
  }

  // Renders the `count` newest versions of every software.
  RenderLatest(count, parent) {
    for (const versions of this.GroupBySoftware().values()) {
      versions.sort((a, b) => this.CompareVersions(b.version, a.version));
      this.RenderList(versions.slice(0, count), parent);
    }
  }

  // Renders up to `count` licenses in random order and returns how many matched the filters.
  RenderAll(count, parent, filters = {}) {
    const matches = this.Filter(this.randomOrder, filters);
    this.RenderList(matches.slice(0, count), parent);
    return matches.length;
  }

  RenderList(licenses, parent) {
    licenses.forEach((license) => license.Render(parent));
  }

  Filter(licenses, { search = '', software = '', category = '', onlyOffers = false } = {}) {
    const text = search.trim().toLowerCase();
    return licenses.filter((license) =>
      (!text || `${license.software} ${license.version}`.toLowerCase().includes(text))
      && (!software || license.software === software)
      && (!category || license.category === category)
      && (!onlyOffers || license.hasDiscount));
  }

  GetUniqueValues(property) {
    return [...new Set(this.licenses.map((license) => license[property]))];
  }

  GroupBySoftware() {
    const groups = new Map();
    for (const license of this.licenses) {
      if (!groups.has(license.software)) groups.set(license.software, []);
      groups.get(license.software).push(license);
    }
    return groups;
  }

  // Compares dotted versions numerically: "10.0" > "9.5" and "2024" > "2023".
  CompareVersions(versionA, versionB) {
    const partsA = versionA.split('.').map(Number);
    const partsB = versionB.split('.').map(Number);
    for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
      const difference = (partsA[i] || 0) - (partsB[i] || 0);
      if (difference !== 0) return difference;
    }
    return 0;
  }

  // Fisher-Yates shuffle on a copy, so the original order is kept.
  Shuffle(licenses) {
    const shuffled = [...licenses];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}
