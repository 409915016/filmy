<template>
    <div id="landing">
        <SearchBar
            :value="searchText"
            @on-change="onSearchChange"/>
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
                searchText: '',
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
                    this.categories = categories.map(i => i.getCacheData())
                    this.$emit('update-blog-title', this.config.title)
                    this.$emit('update-title', '')
                })
        },
        methods: {
            onSearchChange({value, query}) {
                this.$router.push({
                    path: `/search/${encodeURIComponent(value)}`,
                    query
                })
            }
        },
        components: {
            LandingView,
            Content,
            SearchBar
        }
    }
</script>
