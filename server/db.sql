create database chats

create table users(
    id serial primary key,
    username varchar(50) unique not null,
    pword text not null,
    "lastActive" timestamptz default Now()
);

create table messages(
    "messageId" serial primary key,
    "authorId" int references users(id) not null,
    msg text not null,
    "createdAt" timestamptz default Now()
);

insert into users(username, pword) values('bob', 'bob');

insert into messages("authorId", msg) values(1, 'Hi Im bob lol');