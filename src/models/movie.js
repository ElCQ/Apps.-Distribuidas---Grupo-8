class Movie{
    #title
    #subtitle
    #synopsis
    #genre
    #default_poster
    #images
    #videos
    #release_date
    #duration
    #qualification
    #qualifiers
    #crew
    #cast
    #comments
    #id
    constructor({title, subtitle, synopsis, genre, default_poster, images, videos, release_date, duration, qualification, qualifiers, crew, cast, comments, id}){
        this.#title = title
        this.#subtitle = subtitle
        this.#synopsis = synopsis
        this.#genre = genre
        this.#default_poster = default_poster
        this.#images = images
        this.#videos = videos
        this.#release_date = release_date
        this.#duration = +duration
        this.#qualification = +qualification
        this.#qualifiers = +qualifiers
        this.#crew = crew
        this.#cast = cast
        this.#comments = comments
        this.#id = id
    }
    getTitle(){
        return this.#title
    }
    setTitle(title){
        this.#title = title
    }
    getSubtitle(){
        return this.#subtitle
    }
    setSubtitle(subtitle){
        this.#subtitle = subtitle
    }
    getSynopsis(){
        return this.#synopsis
    }
    setSynopsis(synopsis){
        this.#synopsis = synopsis
    }
    getGenre(){
        return this.#genre
    }
    setGenre(genre){
        this.#genre = genre
    }
    getDefaultPoster(){
        return this.#default_poster
    }
    setDefaultPoster(default_poster){
        this.#default_poster = default_poster
    }
    getImages(){
        return this.#images
    }
    setImages(images){
        this.#images = images
    }
    getVideos(){
        return this.#videos
    }
    setVideos(videos){
        this.#videos = videos
    }
    getReleaseDate(){
        return this.#release_date
    }
    setReleaseDate(release_date){
        this.#release_date = release_date
    }
    getDuration(){
        return this.#duration
    }
    setDuration(duration){
        this.#duration = duration
    }
    addQualification(qualification){
        this.#qualifiers = this.#qualifiers + 1
        this.#qualification = (this.#qualification+qualification)/(this.#qualifiers)
    }
    getQualification(){
        return this.#qualification
    }
    setQualification(qualification){
        this.#qualification = qualification
    }
    getQualifiers(){
        return this.#qualifiers
    }
    setQualifiers(qualifiers){
        this.#qualifiers = qualifiers
    }
    getCrew(){
        return this.#crew
    }
    setCrew(crew){
        this.#crew = crew
    }
    getCast(){
        return this.#cast
    }
    setCast(cast){
        this.#cast = cast
    }
    getComments(){
        return this.#comments
    }
    setComments(comments){
        this.#comments = comments
    }
    getID(){
        return this.#id
    }
    setID(id){
        this.#id = id;
    }
    modify({title, subtitle, synopsis, genre, default_poster, images, videos, release_date, duration, qualification, qualifiers, crew, cast, comments}){
        this.setTitle(title);
        this.setSubtitle(subtitle);
        this.setSynopsis(synopsis);
        this.setGenre(genre);
        this.setDefaultPoster(default_poster)
        this.setImages(images);
        this.setVideos(videos);
        this.setReleaseDate(release_date);
        this.setDuration(duration);
        this.setQualification(qualification);
        this.setQualifiers(qualifiers);
        this.setCrew(crew);
        this.setCast(cast);
        this.setComments(comments);
    }
    async getContent(){
        let content = {};
        let images = [];
        content["images"] = this.#images;
        content["videos"] = this.#videos;
        return content;
    }
    async toDTO(){
        const dto = {
            title: this.#title,
            subtitle: this.#subtitle,
            synopsis: this.#synopsis,
            genre: this.#genre.toDTO(),
            default_poster: await this.#default_poster,
            images: this.#images.map(image => image.toDTO()),
            videos: this.#videos,
            release_date: this.#release_date,
            duration: this.#duration,
            qualification: this.#qualification,
            qualifiers: this.#qualifiers,
            crew: this.#crew,
            cast: this.#cast,
            comments: this.#comments.map(comment => comment.toDTO()),
            id: this.#id
        }
        return dto
    }
}
export default Movie;