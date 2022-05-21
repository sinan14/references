export class Category {
    name: String       
}
export class relatedArticle {
    related: String       
}
export class relatedProduct {
    product: String      
}
export class taggedCategory {
    category: String      
}
export class Likes {
    like: String       
}
export class Article {
    
        heading: String;
        readTime: String;
        categories: [Category];
        image: String;
        relatedArticles: [relatedArticle];
        relatedProducts: [relatedProduct];
        taggedCategories: [relatedProduct];
        reviewedBy: String;
        authorName: String;
        designation: String;
        trending:Boolean;
        newest: Boolean;
        homepageMain: Boolean;
        homepageSub: Boolean;
        description: String;
        likes: [Likes];
        
    }
    
    