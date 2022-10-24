class Dialog {
    constructor() {
        this.show = null;
    }

    register(show) {
        this.show = show;
    }
}

export default new Dialog();
