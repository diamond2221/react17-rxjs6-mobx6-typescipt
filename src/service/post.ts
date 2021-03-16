export class Post {
    userId!: number;
    id!: number;
    title!: string;
    body!: string;
    toString(): string {
        return `Post {userId = ${this.userId}, id = ${this.id}, title = "${this.title}", body = "${this.body.replace(/\n/g, '\\n')}"}`;
    }
}
