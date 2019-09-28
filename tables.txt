use guideme2_0;

create table accounts (
	UID integer primary key auto_increment,
    name varchar(30),
    username varchar(20) unique,
    password varchar(20),
    yearofjoin numeric(4, 0),
    phoneno numeric(10, 0),
    emailid varchar(40) unique
); 

-- drop table accounts;
-- drop table students; 
-- drop table faculties;
-- drop table admins;
-- drop table grps;
-- drop table projects;
-- drop table reviewpanel;
-- drop table guides;
-- drop table worksin;
-- drop table assignedto;
-- drop table evaluates;

select * from accounts;
select * from students;
select * from faculties;

create table students(
	UID integer,
	rollno varchar(20) primary key,
    skillset varchar(100),
    department varchar(30),
    degree varchar(20),
    foreign key (UID) references accounts(UID)
);

create table faculties(
	UID integer ,
	qualification varchar(20),
    designation varchar(20),
    yearsofexp numeric(3, 0),
    noofprojects numeric(2, 0),
    foreign key (UID) references accounts(UID)
);

create table admins(
	UID integer,
    foreign key (UID) references accounts(UID)
);

create table grps(
	GID integer primary key auto_increment,
    membercount numeric(2, 0),
    startdate date,
    enddate date,
    noofrevcomp numeric(1, 0),
    grade varchar(3)
);

create table projects(
	PID integer primary key auto_increment,
	title varchar(20),
    difficulty varchar(20),
    status varchar(20),
    domain varchar(20)
);

create table reviewpanel(
	panelno integer primary key auto_increment,
    status varchar(20),
    slot varchar(20)
);

create table guides(
	UID integer,
    GID integer,
    foreign key (UID) references accounts(UID),
    foreign key (GID) references grps(GID)
);

create table worksin(
	UID integer auto_increment,
    GID integer,
    foreign key (UID) references accounts(UID),
    foreign key (GID) references grps(GID)
);

create table assignedto(
	GID integer auto_increment,
    PID integer,
    foreign key (GID) references grps(GID),
    foreign key (PID) references projects(PID)
);

create table evaluates(
	GID integer,
    panelno integer,
    foreign key (GID) references grps(GID),
    foreign key (panelno) references reviewpanel(panelno)
);
	