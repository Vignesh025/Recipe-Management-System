USE [master]
GO
/****** Object:  Database [RecipeMgmt]    Script Date: 20-03-2025 09:36:44 ******/
CREATE DATABASE [RecipeMgmt]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'RecipeMgmt', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\RecipeMgmt.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'RecipeMgmt_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\RecipeMgmt_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [RecipeMgmt] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [RecipeMgmt].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [RecipeMgmt] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [RecipeMgmt] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [RecipeMgmt] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [RecipeMgmt] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [RecipeMgmt] SET ARITHABORT OFF 
GO
ALTER DATABASE [RecipeMgmt] SET AUTO_CLOSE ON 
GO
ALTER DATABASE [RecipeMgmt] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [RecipeMgmt] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [RecipeMgmt] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [RecipeMgmt] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [RecipeMgmt] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [RecipeMgmt] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [RecipeMgmt] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [RecipeMgmt] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [RecipeMgmt] SET  ENABLE_BROKER 
GO
ALTER DATABASE [RecipeMgmt] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [RecipeMgmt] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [RecipeMgmt] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [RecipeMgmt] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [RecipeMgmt] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [RecipeMgmt] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [RecipeMgmt] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [RecipeMgmt] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [RecipeMgmt] SET  MULTI_USER 
GO
ALTER DATABASE [RecipeMgmt] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [RecipeMgmt] SET DB_CHAINING OFF 
GO
ALTER DATABASE [RecipeMgmt] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [RecipeMgmt] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [RecipeMgmt] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [RecipeMgmt] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [RecipeMgmt] SET QUERY_STORE = ON
GO
ALTER DATABASE [RecipeMgmt] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [RecipeMgmt]
GO
/****** Object:  Table [dbo].[__EFMigrationsHistory]    Script Date: 20-03-2025 09:36:45 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[__EFMigrationsHistory](
	[MigrationId] [nvarchar](150) NOT NULL,
	[ProductVersion] [nvarchar](32) NOT NULL,
 CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY CLUSTERED 
(
	[MigrationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Recipes]    Script Date: 20-03-2025 09:36:45 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Recipes](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[RecipeName] [nvarchar](max) NOT NULL,
	[ImageUrl] [nvarchar](max) NULL,
	[Ingredients] [nvarchar](max) NOT NULL,
	[Instructions] [nvarchar](max) NOT NULL,
	[Category] [nvarchar](max) NOT NULL,
	[UserId] [int] NOT NULL,
 CONSTRAINT [PK_Recipes] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 20-03-2025 09:36:45 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Username] [nvarchar](max) NOT NULL,
	[Password] [nvarchar](max) NOT NULL,
	[Role] [nvarchar](max) NOT NULL,
 CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Index [IX_Recipes_UserId]    Script Date: 20-03-2025 09:36:45 ******/
CREATE NONCLUSTERED INDEX [IX_Recipes_UserId] ON [dbo].[Recipes]
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT (N'') FOR [Role]
GO
ALTER TABLE [dbo].[Recipes]  WITH CHECK ADD  CONSTRAINT [FK_Recipes_Users_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Recipes] CHECK CONSTRAINT [FK_Recipes_Users_UserId]
GO
USE [master]
GO
ALTER DATABASE [RecipeMgmt] SET  READ_WRITE 
GO
