<template>
    <Carousel :index="slide">
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
    mounted() {
        setTimeout(() => {
            this.slide = 2
        }, 1000);
    }
}

</script>