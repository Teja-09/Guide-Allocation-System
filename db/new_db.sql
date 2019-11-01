use guideme;

create table accounts (
	UID integer primary key auto_increment,
    name varchar(30),
    username varchar(20) unique,
    password varchar(20),
    usertype varchar(1), -- 'S', 'F', 'A'
    -- yearofjoin numeric(4, 0),
    phoneno numeric(10, 0) unique,
    emailid varchar(40) unique
);

create table students(
	SID integer primary key,
	rollno varchar(20) unique,
    CGPA numeric(4, 2),
    skillset varchar(100),
    department varchar(30),
    degree varchar(20),
    assigned varchar(1), -- 'T', 'F'
    foreign key (SID) references accounts(UID)
);

create table faculties(
	FID integer primary key,
    skillset varchar(20),
	qualification varchar(20),
    designation varchar(20),
    yearsofexp numeric(3, 0),
    assigned varchar(1), -- 'T', 'F'
    foreign key (FID) references accounts(UID)
);

create table projects(
	PID integer primary key auto_increment,
	title varchar(20),
    domain varchar(20),
    status varchar(1)
);

create table guides(
    PID integer primary key,
    FID integer,
    foreign key (PID) references projects(PID),
    foreign key (FID) references faculties(FID)
);

create table worksUnder(
    FID integer,
    SID integer,
    foreign key (FID) references faculties(FID),
    foreign key (SID) references students(SID)
);

-- drop table worksUnder;
-- drop table guides;
-- drop table projects;
-- drop table faculties;
-- drop table students;
-- drop table accounts;

-- select SID, skillset, CGPA from students order by CGPA desc;