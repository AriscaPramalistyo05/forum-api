class KomentarDetail {
  constructor(payload) {
    this._cekPayload(payload);

    const { id, username, date, content, isDelete } = payload;
    this.id = id;
    this.username = username;
    this.date = date;
    this.content = isDelete ? "**komentar telah dihapus**" : content;
  }

  _cekPayload({ id, username, date, content, isDelete }) {
    if (
      !id ||
      !username ||
      !date ||
      typeof content !== "string" ||
      typeof isDelete !== "boolean"
    ) {
      throw new Error("KOMENTAR_DETAIL.KURANG_PROPERTI");
    }

    if (typeof id !== "string" || typeof username !== "string") {
      throw new Error("KOMENTAR_DETAIL.TIPE_DATA_SALAH");
    }
  }
}

export default KomentarDetail;
