class BikinThread {
  constructor(payload) {
    this._cekPayload(payload);

    const { title, body, owner } = payload;
    this.title = title;
    this.body = body;
    this.owner = owner;
  }

  _cekPayload({ title, body, owner }) {
    if (!title || !body || !owner) {
      throw new Error('BIKIN_THREAD.KURANG_PROPERTI');
    }

    if (typeof title !== 'string' || typeof body !== 'string' || typeof owner !== 'string') {
      throw new Error('BIKIN_THREAD.TIPE_DATA_SALAH');
    }
  }
}

export default BikinThread;
