class ThreadDibuat {
  constructor(payload) {
    this._cekPayload(payload);

    const { id, title, owner } = payload;
    this.id = id;
    this.title = title;
    this.owner = owner;
  }

  _cekPayload({ id, title, owner }) {
    if (!id || !title || !owner) {
      throw new Error('THREAD_DIBUAT.KURANG_PROPERTI');
    }

    if (typeof id !== 'string' || typeof title !== 'string' || typeof owner !== 'string') {
      throw new Error('THREAD_DIBUAT.TIPE_DATA_SALAH');
    }
  }
}

export default ThreadDibuat;
