import './Carousel.scss'

export default {
    name: 'Carousel',
    props: {
        index: Number
    },
    render(h) {
        const slides = this.childElements().map( vnode => <div class="carousel__slide">{vnode}</div> ) // Wrap elk child element in een div
        if (this.index) {
            var left = (this.index * -100) + '%';
        } else {
            var left = 0;
        }
        return <div class="carousel">
            <div class="carousel__body">
                <div class="carousel__slides" style={{left: left}}>
                    {slides}
                </div>
            </div>
            <div class="carousel__previous" onClick={this.previous}></div>
            <div class="carousel__next" onClick={this.next}></div>
        </div>
    },
    methods: {
        childElements() {
            return this.$slots.default.filter( vnode => (vnode.tag || vnode.text.match(/^\s+$/) === null) ) // filter empty text-nodes
        },
        previous() {
            if (this.index === 0) {
                this.$emit('change', this.childElements().length - 1)
            } else {
                this.$emit('change', this.index - 1)
            }
        },
        next() {
            if (this.index + 1 >= this.childElements().length) {
                this.$emit('change', 0) // Jump back to the first
            } else {
                this.$emit('change', this.index + 1)
            }
        }
    }
}