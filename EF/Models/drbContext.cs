using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace EF.Models
{
    public partial class drbContext : DbContext
    {
        public drbContext()
        {
        }

        public drbContext(DbContextOptions<drbContext> options)
            : base(options)
        {
        }

        public virtual DbSet<CategoryTb> CategoryTb { get; set; }
        public virtual DbSet<CitiesTb> CitiesTb { get; set; }
        public virtual DbSet<ClientTb> ClientTb { get; set; }
        public virtual DbSet<ClientTypesTb> ClientTypesTb { get; set; }
        public virtual DbSet<DailyNumOfOrdersTb> DailyNumOfOrdersTb { get; set; }
        public virtual DbSet<DriversProfitLogTb> DriversProfitLogTb { get; set; }
        public virtual DbSet<DriversRatingsTb> DriversRatingsTb { get; set; }
        public virtual DbSet<MerchantBalanceLogTb> MerchantBalanceLogTb { get; set; }
        public virtual DbSet<MerchantBalanceLogTypesTb> MerchantBalanceLogTypesTb { get; set; }
        public virtual DbSet<MerchantTypesTb> MerchantTypesTb { get; set; }
        public virtual DbSet<OrderStatusTb> OrderStatusTb { get; set; }
        public virtual DbSet<OrdersDriversRequestsLogsTb> OrdersDriversRequestsLogsTb { get; set; }
        public virtual DbSet<OrdersItemsTb> OrdersItemsTb { get; set; }
        public virtual DbSet<OrdersLogsTb> OrdersLogsTb { get; set; }
        public virtual DbSet<OrdersTb> OrdersTb { get; set; }
        public virtual DbSet<PackagePerparationTimesTb> PackagePerparationTimesTb { get; set; }
        public virtual DbSet<PackageTypesTb> PackageTypesTb { get; set; }
        public virtual DbSet<PaymentTypesTb> PaymentTypesTb { get; set; }
        public virtual DbSet<SettingsTb> SettingsTb { get; set; }
        public virtual DbSet<StoresTb> StoresTb { get; set; }
        public virtual DbSet<SystemProfitLogTb> SystemProfitLogTb { get; set; }
        public virtual DbSet<UserRulesTb> UserRulesTb { get; set; }
        public virtual DbSet<UserTb> UserTb { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseSqlServer("Data Source=LAPTOP-SPU04J46;Initial Catalog=drb;Integrated Security=True");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<CategoryTb>(entity =>
            {
                entity.ToTable("CategoryTB");

                entity.Property(e => e.IsActive)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.NameAr)
                    .IsRequired()
                    .HasMaxLength(500);

                entity.Property(e => e.NameEn).HasMaxLength(500);
            });

            modelBuilder.Entity<CitiesTb>(entity =>
            {
                entity.ToTable("CitiesTB");

                entity.Property(e => e.IsActive)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.NameAr)
                    .IsRequired()
                    .HasMaxLength(150);

                entity.Property(e => e.NameEn).HasMaxLength(150);
            });

            modelBuilder.Entity<ClientTb>(entity =>
            {
                entity.ToTable("ClientTB");

                entity.Property(e => e.ClientName).HasMaxLength(100);

                entity.Property(e => e.ConfirmCode).HasMaxLength(200);

                entity.Property(e => e.CurrentBalance).HasColumnType("money");

                entity.Property(e => e.DriverCarColor).HasMaxLength(150);

                entity.Property(e => e.DriverCarNumber).HasMaxLength(150);

                entity.Property(e => e.DriverCarType).HasMaxLength(150);

                entity.Property(e => e.DriverCircleDistanceKm).HasColumnName("DriverCircleDistanceKM");

                entity.Property(e => e.DriverWithDrawBalance).HasColumnType("money");

                entity.Property(e => e.Email).HasMaxLength(500);

                entity.Property(e => e.IsBlocked).HasColumnName("isBlocked");

                entity.Property(e => e.IsDeleted).HasColumnName("isDeleted");

                entity.Property(e => e.Lang)
                    .HasColumnName("lang")
                    .HasMaxLength(10);

                entity.Property(e => e.MerchantCommercialNum).HasMaxLength(250);

                entity.Property(e => e.MerchantMaroofUrl).HasColumnName("MerchantMaroofURL");

                entity.Property(e => e.MerchantName).HasMaxLength(500);

                entity.Property(e => e.MerchantShippingPrice).HasColumnType("money");

                entity.Property(e => e.Mobile).HasMaxLength(50);

                entity.Property(e => e.NotifyMe)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.Password).HasMaxLength(500);

                entity.Property(e => e.RegisterationDate).HasColumnType("datetime");

                entity.Property(e => e.TypeIdFk).HasColumnName("TypeIdFK");

                entity.HasOne(d => d.TypeIdFkNavigation)
                    .WithMany(p => p.ClientTb)
                    .HasForeignKey(d => d.TypeIdFk)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ClientTB_ClientTypesTB");
            });

            modelBuilder.Entity<ClientTypesTb>(entity =>
            {
                entity.ToTable("ClientTypesTB");

                entity.Property(e => e.NameAr)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(e => e.NameEn)
                    .IsRequired()
                    .HasMaxLength(200);
            });

            modelBuilder.Entity<DailyNumOfOrdersTb>(entity =>
            {
                entity.ToTable("DailyNumOfOrdersTB");

                entity.Property(e => e.Id).ValueGeneratedOnAdd();

                entity.Property(e => e.NameAr)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(e => e.NameEn).HasMaxLength(200);
            });

            modelBuilder.Entity<DriversProfitLogTb>(entity =>
            {
                entity.ToTable("DriversProfitLogTB");

                entity.Property(e => e.Balance).HasColumnType("money");

                entity.Property(e => e.CreationDate).HasColumnType("datetime");

                entity.Property(e => e.DriverIdFk).HasColumnName("DriverIdFK");

                entity.Property(e => e.OrderIdFk).HasColumnName("OrderIdFK");

                entity.HasOne(d => d.OrderIdFkNavigation)
                    .WithMany(p => p.DriversProfitLogTb)
                    .HasForeignKey(d => d.OrderIdFk)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_DriversProfitLogTB_OrdersTB");
            });

            modelBuilder.Entity<DriversRatingsTb>(entity =>
            {
                entity.ToTable("DriversRatingsTB");

                entity.Property(e => e.CreationDate).HasColumnType("datetime");

                entity.Property(e => e.DriverIdFk).HasColumnName("DriverIdFK");

                entity.Property(e => e.Notes).HasMaxLength(300);

                entity.Property(e => e.OrderIdFk).HasColumnName("OrderIdFK");
            });

            modelBuilder.Entity<MerchantBalanceLogTb>(entity =>
            {
                entity.ToTable("MerchantBalanceLogTB");

                entity.Property(e => e.Balance).HasColumnType("money");

                entity.Property(e => e.ClientIdFk).HasColumnName("ClientIdFK");

                entity.Property(e => e.CreationDate).HasColumnType("datetime");

                entity.Property(e => e.OrderIdFk).HasColumnName("OrderIdFK");

                entity.Property(e => e.PaymentId).HasMaxLength(500);

                entity.Property(e => e.PaymentTypeIdFk).HasColumnName("PaymentTypeIdFK");

                entity.Property(e => e.ReasonNote).HasMaxLength(500);

                entity.Property(e => e.TransactionTypeFk).HasColumnName("TransactionTypeFK");

                entity.HasOne(d => d.ClientIdFkNavigation)
                    .WithMany(p => p.MerchantBalanceLogTb)
                    .HasForeignKey(d => d.ClientIdFk)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_MerchantDepositeLogTB_ClientTB");

                entity.HasOne(d => d.PaymentTypeIdFkNavigation)
                    .WithMany(p => p.MerchantBalanceLogTb)
                    .HasForeignKey(d => d.PaymentTypeIdFk)
                    .HasConstraintName("FK_MerchantDepositeLogTB_PaymentTypesTB");

                entity.HasOne(d => d.TransactionTypeFkNavigation)
                    .WithMany(p => p.MerchantBalanceLogTb)
                    .HasForeignKey(d => d.TransactionTypeFk)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_MerchantBalanceLogTB_MerchantBalanceLogTypesTB");
            });

            modelBuilder.Entity<MerchantBalanceLogTypesTb>(entity =>
            {
                entity.ToTable("MerchantBalanceLogTypesTB");

                entity.Property(e => e.Color).HasMaxLength(200);

                entity.Property(e => e.NameAr)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(e => e.NameEn).HasMaxLength(200);
            });

            modelBuilder.Entity<MerchantTypesTb>(entity =>
            {
                entity.ToTable("MerchantTypesTB");

                entity.Property(e => e.Id).ValueGeneratedOnAdd();

                entity.Property(e => e.NameAr)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.NameEn).HasMaxLength(50);
            });

            modelBuilder.Entity<OrderStatusTb>(entity =>
            {
                entity.ToTable("OrderStatusTB");

                entity.Property(e => e.Color)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.Icon)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.IsActive)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.NameAr).HasMaxLength(200);

                entity.Property(e => e.NameEn).HasMaxLength(200);
            });

            modelBuilder.Entity<OrdersDriversRequestsLogsTb>(entity =>
            {
                entity.ToTable("OrdersDriversRequestsLogsTB");

                entity.Property(e => e.CreationDate).HasColumnType("datetime");

                entity.Property(e => e.Notes).HasMaxLength(300);

                entity.HasOne(d => d.Order)
                    .WithMany(p => p.OrdersDriversRequestsLogsTb)
                    .HasForeignKey(d => d.OrderId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_OrdersDriversRequestsLogsTB_OrdersTB");
            });

            modelBuilder.Entity<OrdersItemsTb>(entity =>
            {
                entity.ToTable("OrdersItemsTB");

                entity.Property(e => e.CatIdFk).HasColumnName("CatIdFK");

                entity.Property(e => e.OrderIdFk).HasColumnName("OrderIdFK");

                entity.Property(e => e.PackageTypeIdFk).HasColumnName("PackageTypeIdFK");

                entity.HasOne(d => d.CatIdFkNavigation)
                    .WithMany(p => p.OrdersItemsTb)
                    .HasForeignKey(d => d.CatIdFk)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_OrerItemsTB_CategoryTB");

                entity.HasOne(d => d.OrderIdFkNavigation)
                    .WithMany(p => p.OrdersItemsTb)
                    .HasForeignKey(d => d.OrderIdFk)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_OrdersItemsTB_OrdersTB");

                entity.HasOne(d => d.PackageTypeIdFkNavigation)
                    .WithMany(p => p.OrdersItemsTb)
                    .HasForeignKey(d => d.PackageTypeIdFk)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_OrerItemsTB_PackageTypesTB");
            });

            modelBuilder.Entity<OrdersLogsTb>(entity =>
            {
                entity.ToTable("OrdersLogsTB");

                entity.Property(e => e.Date).HasColumnType("datetime");

                entity.Property(e => e.Note).HasMaxLength(300);

                entity.Property(e => e.OrderIdFk).HasColumnName("OrderIdFK");

                entity.Property(e => e.StatusIdFk).HasColumnName("StatusIdFK");

                entity.HasOne(d => d.OrderIdFkNavigation)
                    .WithMany(p => p.OrdersLogsTb)
                    .HasForeignKey(d => d.OrderIdFk)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_OrdersLogsTB_OrdersTB");
            });

            modelBuilder.Entity<OrdersTb>(entity =>
            {
                entity.ToTable("OrdersTB");

                entity.Property(e => e.AppCommission).HasColumnType("money");

                entity.Property(e => e.CancelReson).HasMaxLength(500);

                entity.Property(e => e.ClientAddress).HasMaxLength(500);

                entity.Property(e => e.ClientCityIdFk).HasColumnName("ClientCityIdFK");

                entity.Property(e => e.ClientPhone)
                    .IsRequired()
                    .HasMaxLength(150);

                entity.Property(e => e.CreationDate).HasColumnType("datetime");

                entity.Property(e => e.DeliveryDate).HasColumnType("datetime");

                entity.Property(e => e.DriverIdFk).HasColumnName("DriverIdFK");

                entity.Property(e => e.IsActive)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.LastChangeDate).HasColumnType("datetime");

                entity.Property(e => e.MerchantIdFk).HasColumnName("MerchantIdFK");

                entity.Property(e => e.Notes).HasMaxLength(500);

                entity.Property(e => e.OrderNumber).HasMaxLength(300);

                entity.Property(e => e.OrderPrice).HasColumnType("money");

                entity.Property(e => e.OrderPriceAfterAppCommission).HasColumnType("money");

                entity.Property(e => e.PackagesTakenDate).HasColumnType("datetime");

                entity.Property(e => e.PaymentId).HasMaxLength(500);

                entity.Property(e => e.PaymentNotes).HasMaxLength(500);

                entity.Property(e => e.PaymentTypeIdFk).HasColumnName("PaymentTypeIdFK");

                entity.Property(e => e.StatusIdFk).HasColumnName("StatusIdFK");

                entity.Property(e => e.StoreIdFk).HasColumnName("StoreIdFK");

                entity.HasOne(d => d.PaymentTypeIdFkNavigation)
                    .WithMany(p => p.OrdersTb)
                    .HasForeignKey(d => d.PaymentTypeIdFk)
                    .HasConstraintName("FK_OrdersTB_PaymentTypesTB");

                entity.HasOne(d => d.StatusIdFkNavigation)
                    .WithMany(p => p.OrdersTb)
                    .HasForeignKey(d => d.StatusIdFk)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_OrdersTB_OrderStatusTB");
            });

            modelBuilder.Entity<PackagePerparationTimesTb>(entity =>
            {
                entity.ToTable("PackagePerparationTimesTB");

                entity.Property(e => e.Id).ValueGeneratedOnAdd();

                entity.Property(e => e.NameAr)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(e => e.NameEn).HasMaxLength(200);
            });

            modelBuilder.Entity<PackageTypesTb>(entity =>
            {
                entity.ToTable("PackageTypesTB");

                entity.Property(e => e.Id).ValueGeneratedOnAdd();

                entity.Property(e => e.NameAr)
                    .IsRequired()
                    .HasMaxLength(150);

                entity.Property(e => e.NameEn).HasMaxLength(150);
            });

            modelBuilder.Entity<PaymentTypesTb>(entity =>
            {
                entity.ToTable("PaymentTypesTB");

                entity.Property(e => e.Id).ValueGeneratedOnAdd();

                entity.Property(e => e.Image).HasMaxLength(200);

                entity.Property(e => e.NameAr)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(e => e.NameEn).HasMaxLength(200);
            });

            modelBuilder.Entity<SettingsTb>(entity =>
            {
                entity.ToTable("SettingsTB");

                entity.Property(e => e.Id).ValueGeneratedOnAdd();

                entity.Property(e => e.AboutAppNameAr).HasMaxLength(500);

                entity.Property(e => e.AboutAppNameEn).HasMaxLength(500);

                entity.Property(e => e.ContactEmail).HasMaxLength(500);

                entity.Property(e => e.ContactPhones).HasMaxLength(500);

                entity.Property(e => e.DriverPointsPerEachOrder).HasDefaultValueSql("((10))");

                entity.Property(e => e.MarchantDefaultShippingPrice)
                    .HasColumnType("money")
                    .HasDefaultValueSql("((35))");

                entity.Property(e => e.SystemProfitFromOrderCancel)
                    .HasColumnType("money")
                    .HasDefaultValueSql("((10))");

                entity.Property(e => e.SystemProfitPercentagePerOrder).HasDefaultValueSql("((2))");

                entity.Property(e => e.SystemTotalProfit).HasColumnType("money");

                entity.Property(e => e.WhatsappPhone).HasMaxLength(500);

                entity.Property(e => e.WorkingHoursAr).HasMaxLength(500);

                entity.Property(e => e.WorkingHoursEn).HasMaxLength(500);
            });

            modelBuilder.Entity<StoresTb>(entity =>
            {
                entity.ToTable("StoresTB");

                entity.Property(e => e.Address).HasMaxLength(200);

                entity.Property(e => e.ClientId).HasComment("Merchant Id");

                entity.Property(e => e.DescAr).HasMaxLength(500);

                entity.Property(e => e.DescEn).HasMaxLength(500);

                entity.Property(e => e.IsActive)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.NameAr)
                    .IsRequired()
                    .HasMaxLength(300);

                entity.Property(e => e.NameEn).HasMaxLength(300);

                entity.HasOne(d => d.Client)
                    .WithMany(p => p.StoresTb)
                    .HasForeignKey(d => d.ClientId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_StoresTB_ClientTB");
            });

            modelBuilder.Entity<SystemProfitLogTb>(entity =>
            {
                entity.ToTable("SystemProfitLogTB");

                entity.Property(e => e.Balance).HasColumnType("money");

                entity.Property(e => e.CreationDate).HasColumnType("datetime");

                entity.Property(e => e.Note).HasMaxLength(500);

                entity.Property(e => e.OrderIdFk).HasColumnName("OrderIdFK");
            });

            modelBuilder.Entity<UserRulesTb>(entity =>
            {
                entity.ToTable("UserRulesTB");

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.RuleName).HasMaxLength(50);
            });

            modelBuilder.Entity<UserTb>(entity =>
            {
                entity.ToTable("UserTB");

                entity.Property(e => e.ConfirmCode).HasMaxLength(50);

                entity.Property(e => e.CreationDate).HasColumnType("datetime");

                entity.Property(e => e.EmailAddress).HasMaxLength(50);

                entity.Property(e => e.FullName).HasMaxLength(50);

                entity.Property(e => e.IsActive)
                    .HasColumnName("isActive")
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.Mobile).HasMaxLength(50);

                entity.Property(e => e.Password).HasMaxLength(500);

                entity.HasOne(d => d.Rule)
                    .WithMany(p => p.UserTb)
                    .HasForeignKey(d => d.RuleId)
                    .HasConstraintName("FK_UsersTB_UserRulesTB");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
