<template>
    <Carousel :index="slide" @change="slideTo">
        <div> Slide 1 </div>
        <div> Slide 2 </div>
        <div> Slide 3 </div>
    </Carousel>
</template>

<script>

import Carousel from './Carousel'

export default {
    name: 'Example',
    components: { Carousel },
    data: () => ({
        slide: 1,
    }),
    methods: {
        slideTo(index) {
            this.slide = index
        }
    }
}

</script>