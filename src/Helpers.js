export class Tensor {
  constructor(dims, values) {
    if (arguments.length === 0) {
      this.dims = null;
      this.values = null;
      return;
    }

    this.dims = dims;
    this.values = values;
  }

  get(indices) {
    if (indices.length !== this.dims.length) {
      let e = Error("Number of indices does not match dimensions");
      throw e;
    }

    let realIndex = 0;
    let currSizeProd = 1;

    for (let i = 0; i < indices.length; i++) {
      realIndex += indices[i] * currSizeProd;
      currSizeProd *= this.dims[i];
    }

    return this.values[realIndex];
  }

  set(indices, value) {
    if (indices.length !== this.dims.length) {
      let e = Error("Number of indices does not match dimensions");
      throw e;
    }

    let realIndex = 0;
    let currSizeProd = 1;

    for (let i = 0; i < indices.length; i++) {
      realIndex += indices[i] * currSizeProd;
      currSizeProd *= this.dims[i];
    }

    this.values[realIndex] = value;
  }

  copy() {
    let c = new Tensor();
    c.dims = this.dims.slice();
    c.values = this.values.slice();
    return c;
  }
}
