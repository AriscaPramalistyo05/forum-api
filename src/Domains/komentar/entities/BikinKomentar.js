class BikinKomentar {
  constructor(payload) {
    this._cekPayload(payload);

    const { content, threadId, owner } = payload;
    this.content = content;
    this.threadId = threadId;
    this.owner = owner;
  }

  _cekPayload({ content, threadId, owner }) {
    if (!content || !threadId || !owner) {
      throw new Error('BIKIN_KOMENTAR.KURANG_PROPERTI');
    }

    if (typeof content !== 'string' || typeof threadId !== 'string' || typeof owner !== 'string') {
      throw new Error('BIKIN_KOMENTAR.TIPE_DATA_SALAH');
    }
  }
}

export default BikinKomentar;
