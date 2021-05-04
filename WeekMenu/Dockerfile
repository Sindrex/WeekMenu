#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:3.1 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:3.1 AS build
WORKDIR /src
COPY ["WeekMenu.csproj", "."]
RUN dotnet restore "./WeekMenu.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "WeekMenu.csproj" -c Release -o /app/build

# install NodeJS 13.x
# see https://github.com/nodesource/distributions/blob/master/README.md#deb
RUN apt-get update -yq 
RUN apt-get install curl gnupg -yq 
RUN curl -sL https://deb.nodesource.com/setup_13.x | bash -
RUN apt-get install -y nodejs

FROM build AS publish
RUN dotnet publish "WeekMenu.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
CMD ASPNETCORE_URLS=http://*:$PORT dotnet WeekMenu.dll

#ENTRYPOINT ["dotnet", "AuroraTracker.dll"]