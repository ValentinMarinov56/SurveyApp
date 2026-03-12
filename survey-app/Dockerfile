FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["SurveyAPI/SurveyAPI.csproj", "SurveyAPI/"]
RUN dotnet restore "SurveyAPI/SurveyAPI.csproj"

COPY . .
WORKDIR "/src/SurveyAPI"

RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:5000

ENTRYPOINT ["dotnet", "SurveyAPI.dll"]