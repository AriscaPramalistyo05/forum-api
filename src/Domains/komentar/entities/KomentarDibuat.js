class KomentarDibuat {
  constructor(payload) {
    this._cekPayload(payload);

    const { id, content, owner } = payload;
    this.id = id;
    this.content = content;
    this.owner = owner;
  }

  _cekPayload({ id, content, owner }) {
    if (!id || !content || !owner) {
      throw new Error('KOMENTAR_DIBUAT.KURANG_PROPERTI');
    }

    if (typeof id !== 'string' || typeof content !== 'string' || typeof owner !== 'string') {
      throw new Error('KOMENTAR_DIBUAT.TIPE_DATA_SALAH');
    }
  }
}

export default KomentarDibuat;
