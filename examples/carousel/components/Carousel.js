import './Carousel.scss'

export default {
    name: 'Carousel',
    props: {
        index: Number
    },
    render(h) {
        const slides = this.$slots.default
            .filter( vnode => (vnode.tag || vnode.text.match(/^\s+$/) === null) ) // filter empty text-nodes
            .map( vnode => <div class="carousel__slide">{vnode}</div> )
        if (this.index) {
            var left = (this.index * -100) + '%';
        } else {
            var left = 0;
        }

        return <div class="carousel">
            <div class="carousel__body" style={{left: left}}>
                {slides}
            </div>
        </div>
    }
}