<template>
    <div id="landing">
        <SearchBar :router="$route.router"></SearchBar>
        <LandingView :config="config"></LandingView>
        <Content :categories="categories"></Content>
    </div>
</template>

<script>
    import Config      from '@/models/Config'
    import Category    from '@/models/Category'
    import LandingView from '@/components/LandingView'
    import Content     from '@/components/Content'
    import SearchBar   from '@/components/SearchBar'

    export default {
        name      : 'LandingPage',
        data() {
            return {
                config    : {},
                categories: []
            }
        },
        mounted() {
            Promise.all([
                Config.load(),
                Category.load()
            ])
                .then(([config, categories]) => {
                    this.config     = config
                    this.categories = categories
                    this.$emit('update-blog-title', this.config.title)
                    this.$emit('update-title', '')
                })
        },
        components: {
            LandingView,
            Content,
            SearchBar
        }
    }
</script>
